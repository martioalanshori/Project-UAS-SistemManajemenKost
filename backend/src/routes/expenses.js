const express = require('express');
const prisma = require('../lib/prisma');
const { authenticateToken, authorizeRole } = require('../lib/middleware');
const router = express.Router();

// GET all expenses
router.get('/', authenticateToken, authorizeRole('Admin'), async (req, res) => {
  try {
    const expenses = await prisma.expense.findMany({
      orderBy: { expense_date: 'desc' }
    });
    res.json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

// POST new expense
router.post('/', authenticateToken, authorizeRole('Admin'), async (req, res) => {
  try {
    const { description, category, amount, expense_date } = req.body;
    if (!description || !category || !amount || !expense_date) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const parsedAmount = parseInt(amount);
    if (isNaN(parsedAmount)) {
      return res.status(400).json({ error: 'amount must be a valid number' });
    }

    const expense = await prisma.expense.create({
      data: {
        description,
        category,
        amount: parsedAmount,
        expense_date
      }
    });
    res.status(201).json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create expense' });
  }
});

// PUT update expense
router.put('/:id', authenticateToken, authorizeRole('Admin'), async (req, res) => {
  try {
    const { description, category, amount, expense_date } = req.body;
    const data = {};
    if (description !== undefined) data.description = description;
    if (category !== undefined) data.category = category;
    if (amount !== undefined) {
      const parsedAmount = parseInt(amount);
      if (isNaN(parsedAmount)) {
        return res.status(400).json({ error: 'amount must be a valid number' });
      }
      data.amount = parsedAmount;
    }
    if (expense_date !== undefined) data.expense_date = expense_date;

    const existing = await prisma.expense.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: 'Expense not found' });

    const expense = await prisma.expense.update({
      where: { id: req.params.id },
      data
    });
    res.json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update expense' });
  }
});

// DELETE expense
router.delete('/:id', authenticateToken, authorizeRole('Admin'), async (req, res) => {
  try {
    const existing = await prisma.expense.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: 'Expense not found' });

    await prisma.expense.delete({
      where: { id: req.params.id }
    });
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

module.exports = router;
