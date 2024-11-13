const express = require('express');
const Expense = require('../models/expense');
const router = express.Router();

// Create a new expense
router.post('/add', async (req, res) => {
  try {
    const { date, category, amount, description } = req.body;
    const newExpense = new Expense({ date, category, amount, description });
    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (err) {
    res.status(500).json({ message: 'Error saving expense', error: err });
  }
});

// Get expenses
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching expenses', error: err });
  }
});

module.exports = router;
