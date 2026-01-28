const express=require('express')
const app=express()
const bodyParser=require('body-parser')
const cors=require('cors')
require('dotenv').config()
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json())
require('./DB/db')
app.use("/user",require('./Routes/route'))
const PORT=process.env.PORT ||4000
app.listen(PORT,()=>{
    console.log(`Server Started at port ${PORT}`)
})