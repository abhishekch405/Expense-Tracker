const express = require("express");
const app=express();
const bodyParser=require('body-parser');
const cors= require('cors');


const loginRoutes=require('./routes/login');

const sequelize=require('./util/database');

const Users=require('./models/users');


app.use(bodyParser.json());
app.use(cors());
app.use('/user',loginRoutes);

// sequelize
// .sync()
// .then(()=>{
//     return Users.findByPk(1);
// }
// ).then(user=>{
//     if(!user){
//         return Expenses.create({name:'Abhishek',email:'abhi@gmail.com',phone:'1234567890'})
//     }
// })
// .then(user=>app.listen(4000))
// .catch(err=>console.log(err));

sequelize
    .sync()
    .then(()=>{
        app.listen(3000);
    })
    .catch(error=>console.log(error));

