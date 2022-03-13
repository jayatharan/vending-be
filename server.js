require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const {upload} = require('./utils')
const {initialDatabase} = require('./dbInital')

const authRouter = require('./routers/authRouter')
const productRouter = require('./routers/productRouter')
const orderRouter = require('./routers/orderRouter')

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.use(cors())

app.use('/images', express.static('images'))
app.use('/auth',authRouter)
app.use('/product', productRouter)
app.use('/order', orderRouter)

app.post('/upload-image',upload.single('image'), async(req,res)=>{
    try{
        if(req.error){
            res.status(400).send({"message":"Something went wrong Try again."})
        }else{
            res.send({img_name:req.file.filename})
        }
    }catch (err){
        res.status(400).send({"message":"Something went wrong Try again."})
    }
})

mongoose.connect(process.env.DB_CONN_STRING,{
    useNewUrlParser: true,
    useUnifiedTopology:true
})
.then((res)=>{
    console.log("DB Connection successful")
    initialDatabase()
    app.listen(process.env.PORT,(res,err)=>{
        if(!err) console.log(`Server running on PORT:${process.env.PORT}`)
        else console.log(err)
    })
})
.catch((err)=>{
    console.log(err)
})