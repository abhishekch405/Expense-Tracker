const dotenv=require('dotenv');
dotenv.config();

const express = require("express");
const app=express();
const bodyParser=require('body-parser');
const cors= require('cors');


const loginRoutes=require('./routes/login');
const expenseRoutes=require('./routes/expenses');
const premiumRoutes=require('./routes/premium');
const forgotpasswordRoutes=require('./routes/forgotPassword');
const sequelize=require('./util/database');

const Users=require('./models/users');
const Expenses=require('./models/expenses');
const Orders=require('./models/orders');
const Passwords=require('./models/passwords');
const Download=require('./models/download');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))
app.use(cors());
app.use('/user',loginRoutes);
app.use(premiumRoutes);
app.use(expenseRoutes);
app.use(forgotpasswordRoutes);

//{force:true}
Users.hasMany(Expenses);
Expenses.belongsTo(Users);
Users.hasMany(Orders);
Orders.belongsTo(Users);
Users.hasMany(Passwords);
Passwords.belongsTo(Users);
Users.hasMany(Download);
Download.belongsTo(Users);
sequelize
    .sync()
    .then(()=>{
        app.listen(3000);
    })
    .catch(error=>console.log(error));

