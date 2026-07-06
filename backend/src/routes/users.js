const express = require('express');
const bcrypt = require('bcrypt');
const prisma = require('../lib/prisma');

const router = express.Router();

// GET all users (excluding password)
router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        fullname: true,
        email: true,
        phone: true,
        role: true,
        avatar: true,
        createdAt: true
      }
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET single user (excluding password)
router.get('/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        fullname: true,
        email: true,
        phone: true,
        role: true,
        avatar: true,
        createdAt: true
      }
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// POST create user (Register)
router.post('/', async (req, res) => {
  try {
    const { fullname, email, phone, role, password, avatar } = req.body;
    
    const hashedPassword = await bcrypt.hash(password || 'defaultpass', 10);
    const user = await prisma.user.create({
      data: {
        fullname,
        email,
        phone,
        role: role || 'Tenant',
        avatar,
        password: hashedPassword
      }
    });
    const { password: _, ...userData } = user;
    res.status(201).json(userData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// PUT update user (fullname, email, phone, role, password, avatar)
router.put('/:id', async (req, res) => {
  try {
    const { fullname, email, phone, role, password, avatar } = req.body;
    const data = {};
    if (fullname !== undefined) data.fullname = fullname;
    if (email !== undefined) data.email = email;
    if (phone !== undefined) data.phone = phone;
    if (role !== undefined) data.role = role;
    if (avatar !== undefined) data.avatar = avatar;
    if (password) data.password = await bcrypt.hash(password, 10);

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data
    });
    const { password: _, ...userData } = user;
    res.json(userData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// DELETE user
router.delete('/:id', async (req, res) => {
  try {
    await prisma.user.delete({
      where: { id: req.params.id }
    });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;
