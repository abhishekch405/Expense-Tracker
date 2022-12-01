const Sequelize=require('sequelize');

const sequelize=require('../util/database');

const Orders= sequelize.define('orders',{
    orderId:{
        type: Sequelize.STRING
    },
    paymentId: Sequelize.STRING
})

module.exports=Orders;