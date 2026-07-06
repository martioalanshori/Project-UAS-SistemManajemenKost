const express = require('express');
const prisma = require('../lib/prisma');
const router = express.Router();

// GET all expenses
router.get('/', async (req, res) => {
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
router.post('/', async (req, res) => {
  try {
    const { description, category, amount, expense_date } = req.body;
    if (!description || !category || !amount || !expense_date) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const expense = await prisma.expense.create({
      data: {
        description,
        category,
        amount: parseInt(amount),
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
router.put('/:id', async (req, res) => {
  try {
    const { description, category, amount, expense_date } = req.body;
    const data = {};
    if (description !== undefined) data.description = description;
    if (category !== undefined) data.category = category;
    if (amount !== undefined) data.amount = parseInt(amount);
    if (expense_date !== undefined) data.expense_date = expense_date;

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
router.delete('/:id', async (req, res) => {
  try {
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
