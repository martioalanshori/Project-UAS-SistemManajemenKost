const express = require('express');
const prisma = require('../lib/prisma');

const router = express.Router();

// GET all tenants (active only by default, ?all=true for all)
router.get('/', async (req, res) => {
  try {
    const where = req.query.all === 'true' ? {} : { status: 'Active' };
    const tenants = await prisma.tenant.findMany({
      where,
      include: { user: true, room: true, application: true }
    });
    res.json(tenants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch tenants' });
  }
});

// GET single tenant
router.get('/:id', async (req, res) => {
  try {
    const tenant = await prisma.tenant.findUnique({
      where: { id: req.params.id },
      include: { user: true, room: true, application: true }
    });
    if (!tenant) return res.status(404).json({ error: 'Tenant not found' });
    res.json(tenant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch tenant' });
  }
});

// POST create tenant (when Admin approves application)
router.post('/', async (req, res) => {
  try {
    const { application_id, room_id, user_id, check_in } = req.body;

    // Validate application exists
    const application = await prisma.rentalApplication.findUnique({ where: { id: application_id } });
    if (!application) return res.status(404).json({ error: 'Application not found' });

    // Validate room is not already occupied
    const existingTenant = await prisma.tenant.findFirst({
      where: { room_id, status: 'Active' }
    });
    if (existingTenant) return res.status(400).json({ error: 'Room is already occupied by an active tenant' });

    // Fetch room to get price
    const room = await prisma.room.findUnique({ where: { id: room_id } });
    if (!room) return res.status(404).json({ error: 'Room not found' });

    const tenant = await prisma.tenant.create({
      data: {
        application_id,
        room_id,
        user_id,
        check_in
      }
    });

    // Create first month payment automatically
    const d = new Date(check_in);
    const monthFor = isNaN(d.getTime())
      ? new Date().getFullYear() + '-' + String(new Date().getMonth() + 1).padStart(2, '0')
      : `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

    await prisma.payment.create({
      data: {
        tenant_id: tenant.id,
        amount: room.price,
        status: 'Belum Bayar',
        month_for: monthFor
      }
    });

    // Update room status to 'Terisi'
    await prisma.room.update({
      where: { id: room_id },
      data: { status: 'Terisi' }
    });

    res.status(201).json(tenant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create tenant' });
  }
});

// DELETE tenant (checkout) - Soft delete
router.delete('/:id', async (req, res) => {
  try {
    const tenant = await prisma.tenant.findUnique({ where: { id: req.params.id } });
    if (!tenant) return res.status(404).json({ error: 'Tenant not found' });

    // Soft delete tenant by changing status to 'Inactive'
    await prisma.tenant.update({
      where: { id: req.params.id },
      data: { status: 'Inactive' }
    });

    // Update room status to 'Kosong'
    await prisma.room.update({
      where: { id: tenant.room_id },
      data: { status: 'Kosong' }
    });

    res.json({ message: 'Tenant checked out successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to checkout tenant' });
  }
});

module.exports = router;
