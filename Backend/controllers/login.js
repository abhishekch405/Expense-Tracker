const Users=require('../models/users');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');


exports.register= async (req,res,next)=>{
    const {name,email,password}=req.body;
    let passres;
    await bcrypt.hash(password,10,(err,result)=>{
        passres=result;
    })
 
    Users.findAll({where:{email:email}})
        .then(users=>{
            const user=users[0];

            if (user){
                res.json({success:false,message:'User already exists. Please login!'})
            }
            else{
                Users.create({name:name,email:email,password:passres}).then(()=>{
                res.json({success:true,message:'Successflly signed up. Please login now!'})
                })         
            }
        })
        .catch(err=>{
            console.log("Error in registering",err);
        })    
};

exports.login= async (req,res,next)=>{
    const {email, password}=req.body;
    try {
        const user=await  Users.findOne({where:{email:email}}); 
        if(!user){
            res.status(404).json({success:false,message:'This user does nott exist!'});
        }
        const passwordCheck=await bcrypt.compare(password,user.password);

        if(!passwordCheck){
            return res.status(400).json({success:false,message:' Password does not match !'})
        }

        const token=jwt.sign({id:user.id},`${process.env.TOKEN_SECRET}`);
        return res.status(200).json({token:token,success:true,message:'Successfully logged in!'})
        
    }
    catch (error) {
        res.json(error);
        console.log(error);
    }   
}