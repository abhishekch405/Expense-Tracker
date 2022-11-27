const path = require('path');

const express = require('express');

const loginController = require('../controllers/login.js');

const router = express.Router();

//router.get('/', shopController.getExpenses);

router.post('/signup', loginController.register);

router.post('/login', loginController.login);

module.exports = router;