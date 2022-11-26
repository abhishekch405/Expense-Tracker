const path = require('path');

const express = require('express');

const loginController = require('../controllers/login.js');

const router = express.Router();

//router.get('/', shopController.getExpenses);

router.post('/signup', loginController.postUser);

module.exports = router;