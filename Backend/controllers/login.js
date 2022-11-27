const Users=require('../models/users');
const bcrypt=require('bcryptjs');

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
            console.log(err);
        })    
};

exports.login= async (req,res,next)=>{
    const {email, password}=req.body;
    try {
        const users=await  Users.findAll({where:{email:email}}); 
        if(users.length>0){
            bcrypt.compare(password,users[0].password,(err,result)=>{
                if(result){
                    
                    return res.status(200).json({success:true,message:'Successfully logged in!'})
                }
                else{
                    console.log(err,result)
                    return res.status(400).json({success:false,message:' Password does not match !'})
                }
            })
        }
        else{
            return res.status(404).json({success:false,message:'This user does nott exist!'})
        }
    } catch (error) {
        console.log(error);
    }

    // Users.findAll({where:{email:email}})
    //     .then(users=>{
    //         const user=users[0];
    //         if(!user){
    //             return res.status(404).json({success:false,message:'This user does nott exist!'})
    //         }
    //         else if (user.password!=password){
    //             console.log("This user",user.password);
    //             return res.status(401).json({success:false,message:' Password does not match !'})
                
    //         }
    //         else if (user && user.password==password){
    //             console.log("This user",user.password);
    //             return res.status(201).json({success:true,message:'Successfully logged in!'})
                
    //         }
    //     })
    //     .catch(err=>{
    //         console.log(err);
    //     })
}