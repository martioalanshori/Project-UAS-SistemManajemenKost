const express = require('express');
const prisma = require('../lib/prisma');
const { authenticateToken, authorizeRole } = require('../lib/middleware.js');

const router = express.Router();

// GET all rooms
router.get('/', async (req, res) => {
  try {
    const rooms = await prisma.room.findMany({
      include: { facilities: true }
    });
    res.json(rooms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

// GET single room
router.get('/:id', async (req, res) => {
  try {
    const room = await prisma.room.findUnique({
      where: { id: req.params.id },
      include: { facilities: true }
    });
    if (!room) return res.status(404).json({ error: 'Room not found' });
    res.json(room);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch room' });
  }
});

// POST create room
router.post('/', authenticateToken, authorizeRole('Admin'), async (req, res) => {
  try {
    const { room_number, price, description, status, image, facilities } = req.body;
    
    if (!room_number || price === undefined) {
      return res.status(400).json({ error: 'room_number and price are required' });
    }
    
    const room = await prisma.room.create({
      data: {
        room_number,
        price: price !== undefined ? parseInt(price) : 0,
        description,
        status,
        image: image || '/img/kamar1.jpg',
        facilities: {
          connect: facilities ? facilities.map(f => ({ id: typeof f === 'string' ? f : f.id })) : []
        }
      },
      include: { facilities: true }
    });
    res.status(201).json(room);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create room' });
  }
});

// PUT update room
router.put('/:id', authenticateToken, authorizeRole('Admin'), async (req, res) => {
  try {
    const { room_number, price, description, status, image, facilities } = req.body;
    
    // First, clear existing facilities, then connect new ones
    // In Prisma, setting a new connect array will just add to existing ones if not set properly,
    // so `set` is used instead of `connect` to overwrite the relationships
    const room = await prisma.room.update({
      where: { id: req.params.id },
      data: {
        room_number,
        price: price !== undefined ? parseInt(price) : undefined,
        description,
        status,
        image,
        facilities: facilities ? {
          set: facilities.map(f => ({ id: typeof f === 'string' ? f : f.id }))
        } : undefined
      },
      include: { facilities: true }
    });
    res.json(room);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update room' });
  }
});

// DELETE room
router.delete('/:id', authenticateToken, authorizeRole('Admin'), async (req, res) => {
  try {
    await prisma.room.delete({
      where: { id: req.params.id }
    });
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete room' });
  }
});

module.exports = router;
