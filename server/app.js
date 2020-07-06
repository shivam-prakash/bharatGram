const express=require('express');
const app=express();
const PORT=5000;
const bodyParser=require('body-parser')
const mongoose=require('mongoose');
const{MONGOURI}=require('./keys');




mongoose.connect(MONGOURI,{useUnifiedTopology: true,useNewUrlParser: true});
mongoose.connection.on('connected',()=>{
    console.log("connected to mongodb");
});
mongoose.connection.on('error',()=>{
    console.log("connection error");
})

require("./models/user");
require("./models/post");
app.use(bodyParser.urlencoded({limit:'10mb', extended: false }));

// parse application/json
app.use(bodyParser.json({limit:'10mb', extended: false }));
app.use(require('./routes/auth'));
app.use(require('./routes/post'));
app.listen(PORT,()=>{
    console.log("server listening at port"+PORT);
})