const Expenses=require('../models/expenses');
const Users=require('../models/users');

const S3Services=require('../services/s3Services');
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
    const limit=req.query.limit;
    let today=new Date();
    let date=new Date('1980-01-01');
    if(limit=="weekly"){
        const todayDateOnly=new Date(today.toDateString());
        date=new Date(todayDateOnly.setDate(todayDateOnly.getDate()-6));
    } 
    else if(limit=='daily'){
        date=new Date(today.toDateString());
    }
    else if(limit=="monthly"){
        date=new Date(today.getFullYear(),today.getMonth(),1);
    }

   try {
    const expenses=await req.user.getExpenses();
    const filteredExpenses=expenses.filter((expense)=>{
        return expense.createdAt>=date;
    })
    //console.log(expenses);
    return res.status(201).json(filteredExpenses);

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

exports.downloadExpenses=async (req,res,next)=>{
    try {
        const expenses=await req.user.getExpenses();
        console.log("expenses uashuah", expenses)
        const userId=req.user.id;
        const stringified=JSON.stringify(expenses);
        const fileName=`expenses${userId}/${new Date()}`;

        const downloadLink=await S3Services.uploadToS3(fileName,stringified);
        req.user.createDownload({fileName:fileName,link:`${downloadLink}`});
        console.log(downloadLink);
        res.status(200).json({success:true,fileUrl:downloadLink});
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,error});
    }
}

exports.previousdownload=async (req,res,next)=>{
    try {
        const downloads=await req.user.getDownloads();
        res.status(200).json({success:true,links:downloads});
    } catch (error) {
        console.log(error);
    }
}