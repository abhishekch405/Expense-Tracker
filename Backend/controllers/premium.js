const Razorpay=require("razorpay");

const Users=require('../models/users');
const Orders=require("../models/orders");

exports.premiumOrder= async (req,res,next)=>{
    var instance=new Razorpay({
        key_id:`rzp_test_vQI2AlV3SQaMgo`,
        key_secret:`q3Ih130FdmhUMqRu7BH3Vinr`
    });

    var options={
        amount:req.body.amount,
        currency:"INR",
        receipt:"order_rcptid_11"
    }

    instance.orders.create(options,(err,order)=>{
        if(err){
            console.log(err);
        }
        else{
            console.log("This is the order",order);
            res.status(201).json({order:order,success:true});
        }

    })
}

exports.updateTransaction=async (req,res,next)=>{
        req.user.update({hasPremium:true})
            .then()
            .catch(err=>{
                console.log(err);
                res.json({err:err})
            });
        console.log(req.body);
        req.user.createOrder({orderId:req.body.orderId,paymentId:req.body.paymentId})
            .then()
            .catch(err=>{
                console.log(err);
                res.json({err:err})
            })
}