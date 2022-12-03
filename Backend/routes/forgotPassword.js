const path = require('path');

const express = require('express');

const passwordController=require('../controllers/forgotPassword');

const router=express.Router();

router.post('/password/forgotpassword',passwordController.forgotPassword);
// //router.get('/', shopController.getExpenses);

// router.post('/signup', loginController.register);

// router.post('/login', loginController.login);

module.exports = router;