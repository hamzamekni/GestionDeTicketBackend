const express =require('express');
const app = express();
const authRoutes= require("./routes/auth")
const formClaim = require('./routes/formClaim')

app.use(express.json());
const mongoose = require('mongoose')
const dotenv = require( 'dotenv');
dotenv.config()
const MONGODB_URI = process.env.MONGODB_URI
const PORT = process.env.PORT || 4000

mongoose.connect(MONGODB_URI).then(()=> {
    console.log('connected to the database')
    app.listen(PORT,()=>{
        console.log('server is running on port 4000')
    })
}).catch(err =>{
    console.log('error connecting to database : ', err.message)
})

app.get('/protected',  (req, res) => {
    res.send('Protected route accessed');
});

app.use("/auth",authRoutes)
app.use("/form",formClaim)

// instance variable from express