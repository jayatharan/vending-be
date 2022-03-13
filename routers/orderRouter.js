const express = require('express')

const Order = require('../models/orderModel')

const orderRouter = express.Router()

orderRouter.post('/', async (req,res)=>{
    try{
        const data = req.body
        const order = new Order(data)
        await order.save()
        res.send({success:true})
    }catch (err){
        res.status(400).send({message:"Something went wrong."})
    }
})

module.exports = orderRouter