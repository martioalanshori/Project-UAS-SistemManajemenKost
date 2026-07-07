const express = require('express');
const bcrypt = require('bcrypt');
const prisma = require('../lib/prisma');
const { authenticateToken, authorizeRole, userSelectFields } = require('../lib/middleware');

const router = express.Router();
// GET all users (excluding password)
router.get('/', authenticateToken, authorizeRole('Admin'), async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: userSelectFields
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET single user (excluding password)
router.get('/:id', authenticateToken, authorizeRole('Admin'), async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: userSelectFields
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// POST create user (Register)
router.post('/', authenticateToken, authorizeRole('Admin'), async (req, res) => {
  try {
    const { fullname, email, phone, role, password, avatar } = req.body;
    
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        fullname,
        email,
        phone,
        role: role || 'Tenant',
        avatar,
        password: hashedPassword
      },
      select: userSelectFields
    });
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// PUT update user (fullname, email, phone, role, password, avatar)
router.put('/:id', authenticateToken, authorizeRole('Admin'), async (req, res) => {
  try {
    const { fullname, email, phone, role, password, avatar } = req.body;
    
    if (email) {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser && existingUser.id !== req.params.id) {
        return res.status(400).json({ error: 'Email already exists' });
      }
    }

    const data = {};
    if (fullname !== undefined) data.fullname = fullname;
    if (email !== undefined) data.email = email;
    if (phone !== undefined) data.phone = phone;
    if (role !== undefined) data.role = role;
    if (avatar !== undefined) data.avatar = avatar;
    if (password) data.password = await bcrypt.hash(password, 10);

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data,
      select: userSelectFields
    });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// DELETE user
router.delete('/:id', authenticateToken, authorizeRole('Admin'), async (req, res) => {
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
