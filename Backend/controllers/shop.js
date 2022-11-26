const Expenses=require('../models/expenses');

exports.getExpenses=  (req,res,next)=>{
    Expenses.findAll().then(expenses=>{
        // console.log("These are the expenses",expenses[0]);
        res.status(201).json(expenses);
    }).catch(err=>console.log(err));
};
exports.postExpenses= (req,res,next)=>{
    //console.log('This is the request Im sending',req);
    const name=req.body.name;
    const email=req.body.email;
    const phone=req.body.phone;
    Expenses.create({name:name,email:email,phone:email});
    Expenses.findAll().then(expenses=>{
        console.log("These are the expenses",expenses[0]);
        res.status(201).json(expenses[0]);
    }).catch(err=>console.log(err));        
};