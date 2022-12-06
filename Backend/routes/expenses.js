const path = require('path');

const express = require('express');

const expenseController = require('../controllers/expenses.js');
const authorizationMiddleware=require("../middleware/authorization");
const router = express.Router();

//router.get('/', shopController.getExpenses);

router.post('/expense/add', authorizationMiddleware.authorization,expenseController.postExpenses);

router.get('/expense/get', authorizationMiddleware.authorization,expenseController.getExpenses);

router.post('/expense/delete', authorizationMiddleware.authorization,expenseController.deleteExpenses);

router.get('/download', authorizationMiddleware.authorization,expenseController.downloadExpenses);

router.get('/previousdownloads', authorizationMiddleware.authorization,expenseController.previousdownload);


module.exports = router;