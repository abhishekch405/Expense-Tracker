const path = require('path');

const express = require('express');

const expenseController = require('../controllers/expenses.js');

const router = express.Router();

//router.get('/', shopController.getExpenses);

router.post('/add', expenseController.postExpenses);


module.exports = router;