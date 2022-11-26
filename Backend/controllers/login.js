const Users=require('../models/users');

exports.postUser= async (req,res,next)=>{
    const {name,email,password}=req.body;

    Users.findAll({where:{email:email}})
        .then(users=>{
            const user=users[0];

            if (user){
                res.json({success:false,message:'User already exists. Please login!'})
            }
            else{
                Users.create({name:name,email:email,password:password}).then(()=>{
                res.json({success:true,message:'Successflly signed up. Please login now!'})
                })         
            }
        })
        .catch(err=>{
            console.log(err);
        })
        


    // Users.create({name:name,email:email,password:password})
    //     .then(result=>{
    //         console.log("Created a user",result.dataValues)
    //         res.status(201)
    //     })
    //     .catch(err=>console.log(err))
    
    // Expenses.findAll().then(expenses=>{
    //     console.log("These are the expenses",expenses[0]);
    //     res.status(201).json(expenses[0]);
    // }).catch(err=>console.log(err));        
};