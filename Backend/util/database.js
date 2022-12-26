const Sequelize = require('sequelize');

const sequelize = new Sequelize('expense-tracker','root',`${process.env.sqlpassword}`,
{
    dialect:'mysql',
    host:'localhost'
});
module.exports = sequelize;