const Sequelize=require('sequelize');
const uuid=require('uuid');
const sequelize=require('../util/database');

const Passwords=sequelize.define('passwords',{
    id:{
        type: Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    uuid:{
        type:Sequelize.STRING,
        allowNull:false
    },
    isactive: {
        type:Sequelize.BOOLEAN,
        allowNull:false
    }
})

module.exports=Passwords;
