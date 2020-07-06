const jwt=require('jsonwebtoken');
const {JWT_SECRET}=require('../keys');
const mongoose=require('mongoose');
const User=mongoose.model("User");
module.exports=(req,res,next)=>{
    console.log(req.body);
    const {authorization}=req.headers;
    if(!authorization){
        res.status(401).json("you must be logged in");
    }
   const token = authorization.replace("Bearer ","");
   console.log(token);
    jwt.verify(token,JWT_SECRET,(err,payload)=>{
    if(err){
      return  res.status(401).json("you must be logged in");
    }
    const {_id}=payload;
    User.findOne({_id})
    .then(userData=>{
      console.log(userData)
        req.body.user=userData;
        next();
    })
})
};