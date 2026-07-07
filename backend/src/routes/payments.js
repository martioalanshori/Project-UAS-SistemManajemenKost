const express = require('express');
const prisma = require('../lib/prisma');
const { authenticateToken, authorizeRole, userSelectFields } = require('../lib/middleware');

const router = express.Router();

// GET all payments
router.get('/', authenticateToken, async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      include: { tenant: { include: { user: { select: userSelectFields }, room: true } } }
    });
    res.json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

// POST create payment (upload proof)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { tenant_id, amount, month_for, proof_image } = req.body;

    if (!tenant_id) {
      return res.status(400).json({ error: 'tenant_id is required' });
    }

    const parsedAmount = parseInt(amount);
    if (isNaN(parsedAmount)) {
      return res.status(400).json({ error: 'amount must be a valid number' });
    }

    // Verify tenant exists
    const tenant = await prisma.tenant.findUnique({ where: { id: tenant_id } });
    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    const payment = await prisma.payment.create({
      data: {
        tenant_id,
        amount: parsedAmount,
        month_for,
        proof_image,
        payment_date: new Date().toISOString(),
        status: 'Menunggu Verifikasi'
      }
    });
    res.status(201).json(payment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create payment' });
  }
});

// PUT update payment (status, proof_image, payment_date)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { status, proof_image, payment_date } = req.body;
    const data = {};
    if (status !== undefined) {
      if (!['Belum Bayar', 'Menunggu Verifikasi', 'Lunas', 'Ditolak'].includes(status)) {
        return res.status(400).json({ error: "status must be one of 'Belum Bayar', 'Menunggu Verifikasi', 'Lunas', 'Ditolak'" });
      }
      data.status = status;
    }
    if (proof_image !== undefined) data.proof_image = proof_image;
    if (payment_date !== undefined) data.payment_date = payment_date;

    const existing = await prisma.payment.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: 'Payment not found' });

    const payment = await prisma.payment.update({
      where: { id: req.params.id },
      data
    });
    res.json(payment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update payment' });
  }
});

// DELETE payment
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const existing = await prisma.payment.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: 'Payment not found' });

    await prisma.payment.delete({
      where: { id: req.params.id }
    });
    res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete payment' });
  }
});

module.exports = router;
