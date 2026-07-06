const express = require('express');
const prisma = require('../lib/prisma');
const router = express.Router();

// GET all notifications (optional ?user_id= filter)
router.get('/', async (req, res) => {
  try {
    const where = req.query.user_id ? { user_id: req.query.user_id } : {};
    const notifications = await prisma.notification.findMany({
      where,
      include: { user: true },
      orderBy: { created_at: 'desc' }
    });
    res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// GET single notification
router.get('/:id', async (req, res) => {
  try {
    const notification = await prisma.notification.findUnique({
      where: { id: req.params.id },
      include: { user: true }
    });
    if (!notification) return res.status(404).json({ error: 'Notification not found' });
    res.json(notification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch notification' });
  }
});

// POST create notification
router.post('/', async (req, res) => {
  try {
    const { user_id, title, message } = req.body;
    if (!user_id || !title || !message) {
      return res.status(400).json({ error: 'user_id, title, and message are required' });
    }
    const notification = await prisma.notification.create({
      data: { user_id, title, message }
    });
    res.status(201).json(notification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create notification' });
  }
});

// PUT mark as read
router.put('/:id', async (req, res) => {
  try {
    const notification = await prisma.notification.update({
      where: { id: req.params.id },
      data: { is_read: true }
    });
    res.json(notification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

// DELETE notification
router.delete('/:id', async (req, res) => {
  try {
    await prisma.notification.delete({ where: { id: req.params.id } });
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
});

module.exports = router;
