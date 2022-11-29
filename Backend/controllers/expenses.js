const Expenses=require('../models/expenses');
const Users=require('../models/users');
// exports.getExpenses=  (req,res,next)=>{
//     Expenses.findAll().then(expenses=>{
//         // console.log("These are the expenses",expenses[0]);
//         res.status(201).json(expenses);
//     }).catch(err=>console.log(err));
// };
exports.postExpenses= async (req,res,next)=>{
    const {amount,description,category}=req.body;
    try {
        const expense=await req.user.createExpense({amount:amount,description:description,category:category});
        console.log("generated ",expense.id);   
         return res.status(201).json({id:expense.id,success:true,message:'Added an expenses'});
    } catch (error) {
        console.log(error);
    }
};

exports.getExpenses=async (req,res,next)=>{
   try {
    const expenses=await req.user.getExpenses();
    console.log(expenses);
    return res.status(201).json(expenses);

   } catch (error) {
    console.log(error);
   }
}


exports.deleteExpenses=async (req,res,next)=>{
    try {
        const expense=await req.user.getExpenses({where:{id:req.body.id}});
        expense[0].destroy();
        res.json({success:true,message:'Deleted an expenses'})


    } catch (error) {
        console.log(error);
    }
}