const Expenses=require('../models/expenses');
const Users=require('../models/users');
const Sequelize=require('sequelize');
const Op=Sequelize.Op;
const S3Services=require('../services/s3Services');
const sequelize = require('../util/database');
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

    let totalExpenses;
    const limit=req.query.limit;
    const page=+req.query.page||1;
    const rows=+req.query.rows||10;
    console.log(page,rows);

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
    const count=await req.user.countExpenses({where:{
        createdAt : { [Op.and]:[{ [Op.gte] : date },{ [Op.lte] : today }]}
    }
    });
    totalExpenses=count;

    const expenses=await req.user.getExpenses({where:{
        createdAt : { [Op.and]:[{ [Op.gte] : date },{ [Op.lte] : today }]}
    },
    order : [['createdAt','DESC']],
    offset:(page-1)*rows,
    limit:rows
    });

    return res.status(200).json({success:true,expenses:expenses,currentPage:page,hasPreviousPage:page>1,hasNextPage:(page*rows)<totalExpenses,previousPage:page-1,nextPage:page+1,lastPage:Math.ceil(totalExpenses/rows)});


   } catch (error) {
    res.json(error);
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

exports.leaderboard=async (req,res,next)=>{

    const leaderBoard= await Users.findAll({
        attributes:['id','name',[sequelize.fn('sum',sequelize.col('expenses.amount')),'total_expense']],
        include:[
            {
                model:Expenses,
                attributes:[]
            }
        ],
        group:['users.id'],
        order:[['total_expense','DESC']]
    })

    return res.json({success:true,leaderBoard:leaderBoard});
}