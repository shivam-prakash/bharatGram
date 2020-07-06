const express = require('express');
const app = express();
const router = express.Router();
const mongoose=require('mongoose');
const User =mongoose.model("User");
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const {JWT_SECRET}=require('../keys');
router.get('/', (req, res) => {

    res.send("hello world");
});

router.post('/signup', (req, res) => {
    console.log(req.body);
    const {password,email,name}=req.body;
    if (!name || !email || !password) {
    res.json({ error: "missing fields" });
    }
    User.findOne({ email: email })
        .then((savedUser) => {
            if (savedUser) {
                res.status(422).json({ error: "user already exists" });
            }
            bcrypt.hash(password,12)
            .then(hashedPassword=>{
                const user = new User({
                    email,
                    password: hashedPassword,
                    name
                })
                user.save()
                    .then(user => {
                        console.log(user);
                        res.json({ msg: "user saved successfully" });
                    }).catch(e => {
                        console.log(e);
                    })
            })
           
        }).catch(e => {
            console.log(e);
        })
})

router.post('/signin', (req, res) => {
    console.log(req);
    const {password,email}=req.body;
    if (!email || !password) {
    res.json({ error: "missing fields" });
    }
    User.findOne({ email: email })
        .then((savedUser) => {
            if (!savedUser) {
              return  res.status(422).json({ error: "user or password incorrect" });
            }
            bcrypt.compare(password,savedUser.password)
            .then(doMatch=>{
               if(doMatch){
                   const{_id,name,email}=savedUser;
                  const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
                    return res.json({token:token,user:{_id,name,email}});
                   
                 
               }else{
                   return res.json("user or password dont match");
               }
            }).catch(e=>{
            console.log(e);
            })
           
        }).catch(e => {
            console.log(e);
        })
})


module.exports=router;