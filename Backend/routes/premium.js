const path = require('path');

const express = require('express');


const premiumController=require("../controllers/premium");
const authorizationMiddleware=require("../middleware/authorization");
const router = express.Router();

//router.get('/', shopController.getExpenses);

router.post('/premium/order', authorizationMiddleware.authorization,premiumController.premiumOrder);

router.post('/transaction/detail', authorizationMiddleware.authorization,premiumController.updateTransaction);

//router.get('/allusers',authorizationMiddleware.authorization,premiumController.getAllUsers);

module.exports = router;