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

//{force:true}
sequelize
    .sync()
    .then(()=>{
        app.listen(3000);
    })
    .catch(error=>console.log(error));

