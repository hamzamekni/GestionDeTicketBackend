//create router register,login
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const User = require('../Models/user');
const router = express.Router();

//logout
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.send('Logged out');
});
//Register
router.post('/register',async (req,res)=>{
    try {

        const {username,email,password}=req.body;
        const user = new User({ username,email, password, role: 'USER' });
        await user.save();
        res.status(201).send('User registered successfully');
    } catch (error) {
        res.status(400).send(error.message)
    }
})

//login
router.post('/login',async (req,res)=>{
    try {
        const {username,password}=req.body;
        const user = await User.findOne({username: username});
        if(!user){
            return res.status(404).send('user not found')
        }
        const isPasswordMatch =await bcrypt.compare(password,user.password);
        if(!isPasswordMatch){
            return res.status(401).send('invalid password')
        }
        const token = jwt.sign({ _id: user._id, email:user.email, role: user.role }, process.env.JWT_SECRET);
        res.send({token:token})
    } catch (error) {
        res.status(400).send(error.message)
    }});

module.exports=router;