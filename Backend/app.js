const express = require("express");
const app=express();
const bodyParser=require('body-parser');
const cors= require('cors');


const loginRoutes=require('./routes/login');
const expenseRoutes=require('./routes/expenses');

const sequelize=require('./util/database');

const Users=require('./models/users');
const Expenses=require('./models/expenses');

app.use(bodyParser.json());
app.use(cors());
app.use('/user',loginRoutes);

app.use('/expense',expenseRoutes);

//{force:true}
Users.hasMany(Expenses);
Expenses.belongsTo(Users);

sequelize
    .sync()
    .then(()=>{
        app.listen(3000);
    })
    .catch(error=>console.log(error));

