const Expenses=require('../models/expenses');

// exports.getExpenses=  (req,res,next)=>{
//     Expenses.findAll().then(expenses=>{
//         // console.log("These are the expenses",expenses[0]);
//         res.status(201).json(expenses);
//     }).catch(err=>console.log(err));
// };
exports.postExpenses= (req,res,next)=>{
    const {amount,description,category}=req.body;
    
    Expenses.create({amount:amount,description:description,category:category});
    Expenses.findAll().then(expenses=>{
        console.log("These are the expenses",expenses[0]);
        res.status(201).json(expenses[0]);
    }).catch(err=>console.log(err));        
};