//create model of user Document
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
    username:{type:String,unique:true},
    email:String,
    password:String,
    role: { type: String, default: 'USER' }
})

userSchema.pre('save', async function(next){
    const user =this;
    if(user.isModified('password')){
        user.password= await bcrypt.hash(user.password,10)
    }
    next();
})


const User=mongoose.model("user", userSchema)
module.exports=User;