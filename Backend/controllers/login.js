const Users=require('../models/users');

exports.register= async (req,res,next)=>{
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

exports.login=(req,res,next)=>{
    const {email, password}=req.body;
    Users.findAll({where:{email:email}})
        .then(users=>{
            const user=users[0];
            if(!user){
                res.status(404).json({success:false,message:'This user does nott exist!, kindly signup.'})
            }
            else if (user && user.password!=password){
                console.log("This user",user.password);
                res.status(404).json({success:false,message:' Password does not match !'})
                
            }
            else if (user && user.password==password){
                console.log("This user",user.password);
                res.status(201).json({success:true,message:'Successfully logged in!'})
                
            }
        })
        .catch(err=>{
            console.log(err);
        })


}