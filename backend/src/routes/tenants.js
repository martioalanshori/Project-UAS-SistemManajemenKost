const express = require('express');
const prisma = require('../lib/prisma');

const { authenticateToken, userSelectFields } = require('../lib/middleware');

const router = express.Router();

// GET all tenants (active only by default, ?all=true for all)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const where = req.query.all === 'true' ? {} : { status: 'Active' };
    const tenants = await prisma.tenant.findMany({
      where,
      include: { user: { select: userSelectFields }, room: true, application: true }
    });
    res.json(tenants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch tenants' });
  }
});

// GET single tenant
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const tenant = await prisma.tenant.findUnique({
      where: { id: req.params.id },
      include: { user: { select: userSelectFields }, room: true, application: true }
    });
    if (!tenant) return res.status(404).json({ error: 'Tenant not found' });
    res.json(tenant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch tenant' });
  }
});

// POST create tenant (when Admin approves application)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { application_id, room_id, user_id, check_in } = req.body;

    const tenant = await prisma.$transaction(async (tx) => {
      // Validate application exists
      const application = await tx.rentalApplication.findUnique({ where: { id: application_id } });
      if (!application) throw new Error('Application not found');

      // Validate room is not already occupied
      const existingTenant = await tx.tenant.findFirst({
        where: { room_id, status: 'Active' }
      });
      if (existingTenant) throw new Error('Room is already occupied by an active tenant');

      // Fetch room to get price
      const room = await tx.room.findUnique({ where: { id: room_id } });
      if (!room) throw new Error('Room not found');

      const newTenant = await tx.tenant.create({
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

      await tx.payment.create({
        data: {
          tenant_id: newTenant.id,
          amount: room.price,
          status: 'Belum Bayar',
          month_for: monthFor
        }
      });

      // Update room status to 'Terisi'
      await tx.room.update({
        where: { id: room_id },
        data: { status: 'Terisi' }
      });

      return newTenant;
    });

    res.status(201).json(tenant);
  } catch (error) {
    if (error.message === 'Application not found' || error.message === 'Room not found') return res.status(404).json({ error: error.message });
    if (error.message === 'Room is already occupied by an active tenant') return res.status(400).json({ error: error.message });
    console.error(error);
    res.status(500).json({ error: 'Failed to create tenant' });
  }
});

// DELETE tenant (checkout) - Soft delete
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.findUnique({ where: { id: req.params.id } });
      if (!tenant) throw new Error('Tenant not found');

      // Soft delete tenant by changing status to 'Inactive'
      await tx.tenant.update({
        where: { id: req.params.id },
        data: { status: 'Inactive' }
      });

      // Update room status to 'Kosong'
      await tx.room.update({
        where: { id: tenant.room_id },
        data: { status: 'Kosong' }
      });
    });

    res.json({ message: 'Tenant checked out successfully' });
  } catch (error) {
    if (error.message === 'Tenant not found') return res.status(404).json({ error: error.message });
    console.error(error);
    res.status(500).json({ error: 'Failed to checkout tenant' });
  }
});

module.exports = router;
