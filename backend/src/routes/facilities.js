const express = require('express');
const prisma = require('../lib/prisma');
const { authenticateToken, authorizeRole } = require('../lib/middleware.js');

const router = express.Router();

// GET all facilities
router.get('/', async (req, res) => {
  try {
    const facilities = await prisma.facility.findMany();
    res.json(facilities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch facilities' });
  }
});

// GET single facility
router.get('/:id', async (req, res) => {
  try {
    const facility = await prisma.facility.findUnique({
      where: { id: req.params.id }
    });
    if (!facility) return res.status(404).json({ error: 'Facility not found' });
    res.json(facility);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch facility' });
  }
});

// POST create facility
router.post('/', authenticateToken, authorizeRole('Admin'), async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'name is required' });
    }
    
    const facility = await prisma.facility.create({
      data: { name }
    });
    res.status(201).json(facility);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create facility' });
  }
});

// PUT update facility
router.put('/:id', authenticateToken, authorizeRole('Admin'), async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'name is required' });
    }
    
    const facility = await prisma.facility.update({
      where: { id: req.params.id },
      data: { name }
    });
    res.json(facility);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update facility' });
  }
});

// DELETE facility
router.delete('/:id', authenticateToken, authorizeRole('Admin'), async (req, res) => {
  try {
    await prisma.facility.delete({
      where: { id: req.params.id }
    });
    res.json({ message: 'Facility deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete facility' });
  }
});

module.exports = router;
