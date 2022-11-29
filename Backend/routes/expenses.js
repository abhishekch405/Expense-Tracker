const path = require('path');

const express = require('express');

const expenseController = require('../controllers/expenses.js');
const authorizationMiddleware=require("../middleware/authorization");
const router = express.Router();

//router.get('/', shopController.getExpenses);

router.post('/add', authorizationMiddleware.authorization,expenseController.postExpenses);

router.get('/get', authorizationMiddleware.authorization,expenseController.getExpenses);

router.post('/delete', authorizationMiddleware.authorization,expenseController.deleteExpenses);

module.exports = router;