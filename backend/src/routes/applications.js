const express = require('express');
const prisma = require('../lib/prisma');

const router = express.Router();

// GET all applications
router.get('/', async (req, res) => {
  try {
    const applications = await prisma.rentalApplication.findMany({
      include: { user: true, room: true }
    });
    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// GET single application
router.get('/:id', async (req, res) => {
  try {
    const application = await prisma.rentalApplication.findUnique({
      where: { id: req.params.id },
      include: { user: true, room: true }
    });
    if (!application) return res.status(404).json({ error: 'Application not found' });
    res.json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch application' });
  }
});

// POST new application
router.post('/', async (req, res) => {
  try {
    const { user_id, room_id, start_date, duration, ktp_image } = req.body;

    if (!user_id || !room_id || !start_date || !duration) {
      return res.status(400).json({ error: 'user_id, room_id, start_date, and duration are required' });
    }

    const dur = parseInt(duration);
    if (isNaN(dur)) {
      return res.status(400).json({ error: 'Duration must be a number' });
    }

    const application = await prisma.rentalApplication.create({
      data: {
        user_id,
        room_id,
        start_date,
        duration: dur,
        ktp_image,
        status: 'Pending'
      },
      include: { user: true, room: true }
    });
    res.status(201).json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

// PUT update application status
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const application = await prisma.rentalApplication.update({
      where: { id: req.params.id },
      data: { status }
    });
    res.json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update application status' });
  }
});

// DELETE application
router.delete('/:id', async (req, res) => {
  try {
    await prisma.rentalApplication.delete({
      where: { id: req.params.id }
    });
    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete application' });
  }
});

module.exports = router;
