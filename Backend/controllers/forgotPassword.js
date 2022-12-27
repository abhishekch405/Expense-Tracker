const Passwords=require('../models/passwords');
const Users=require('../models/users');
const bcrypt=require('bcryptjs');
const {v4:uuidv4} =require('uuid');


exports.forgotPassword=async (req,res,next)=>{
    const email=req.body.email;
    const uuid=uuidv4();
    try {
        const user= await Users.findOne({where:{email:email}});
        if(!user){
            return res.status(404).json({success:false,message:'User not registered, Please sign up!'})
        }
        else{
            await user.createPassword({uuid:uuid,isactive:true})
            return res.status(201).json({success:true,message:`Use this link to reset your Password: http://localhost:3000/password/resetpassword/${uuid}`});
        }
    } catch (error) {
        res.json({error:error});
    }

}
exports.resetPassword=async (req,res,next)=>{
    console.log("inside reset");
    const uuid=req.params.uuid;

    try {
        const password=await Passwords.findOne({where:{uuid:uuid}});
        if(!password){
            return res.status(404).json({success:false,message:'Invalid link'})
        }
        else{
            const userId=password.userId;
            const isactive=password.isactive;

            if(!isactive){
                return res.json({success:false,message:'Link Expired:rest password again'})
            }

            return res.send(`<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Reset Password</title>
            </head>
            <body>
                <div id="div" style="display:flex; flex-direction:column; margin-top:10rem; align-items:center; justify-content:center;">
                    <h3>Enter Your New Password</h3>
                    <form id="form"action="http://${process.env.SERVER_IP}:3000/password/updatepassword" method="POST" >
                    <label for="password">Password:</label>
                    <input type="password"  id="password" name="password" required>
                    <br><br>
                    <input type="hidden"  id="userId" name="userId" value="${userId}" required>
                    <input type="hidden"  id="uuid" name="uuid" value="${uuid}" required>
            
                    <button type="submit" style="cursor:pointer;">Reset Password</button>
                    </form>
                </div>
            </body>
            </html>`)
        }
    } catch (error) {
        console.log(error);
    }

}

exports.updatePassword=async (req,res,next)=>{
    const uuid=req.body.uuid;
    const newPassword=req.body.password;
    const userId=req.body.userId;
    try {
        const user=await Users.findOne({where:{id:userId}});
        const hash=await bcrypt.hash(newPassword,10);
        await user.update({password:hash});

        const request=await Passwords.findOne({where:{uuid:uuid}});
        request.update({isactive:false});

        res.send('Password successfully updated');
    } catch (err) {
        console.log(err);
        res.json({error:err});
    }
}
