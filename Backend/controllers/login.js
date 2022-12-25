const Users=require('../models/users');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');


exports.register= async (req,res,next)=>{
    const {name,email,password}=req.body;
    try {
        const hashedPass=await bcrypt.hash(password,10);
        const user=await Users.findOne({where:{email:email}});
        if (user){
            return res.json({success:false,message:'User already exists. Please login!'})
        }
        else{
            await Users.create({name:name,email:email,password:hashedPass});
            return res.json({success:true,message:`${name} has successfully signed up. Please login now!`});         
        }
        
    } catch (error) {
        console.log("Error in registering",error);
        res.json({success:false,message:"error in registering",error});
    }    
};

exports.login= async (req,res,next)=>{
    const {email, password}=req.body;
    try {
        const user=await  Users.findOne({where:{email:email}}); 
        if(!user){
            res.status(404).json({success:false,message:'This user does not exist!'});
        }
        const passwordCheck=await bcrypt.compare(password,user.password);

        if(!passwordCheck){
            return res.status(401).json({success:false,message:' Password does not match !'})
        }

        const token=jwt.sign({id:user.id},`${process.env.TOKEN_SECRET}`);
        return res.status(200).json({token:token,hasPremium:user.hasPremium,success:true,message:`${user.name} Successfully logged in!`})
        
    }
    catch (error) {
        return res.json(error);
        console.log(error);
    }   
}