const express = require('express')

const {
    verifyToken,
    verifyRefreshToken,
    authorize
} = require('../middlewares/authMiddleware') 

const Product = require('../models/productModel')

const productRouter = express.Router()

productRouter.get('/', async(req,res)=>{
    try{
        const products = await Product.find()
        res.send(products)
    }catch (err) {
        res.status(400).send({message:"Something went wrong."})
    }
})

productRouter.post('/', verifyToken, authorize(["admin"]), async(req,res)=>{
    try{
        const data = req.body
        delete data._id
        const product = new Product(data)
        if(req.file) product.img_name = req.file.filename
        await product.save()
        res.send(product)
    }catch (err) {
        console.log(err)
        res.status(400).send({message:"Something went wrong."})
    }
})

productRouter.put('/:id', verifyToken, authorize(["admin"]), async(req,res)=>{
    try{
        const data =  req.body
        const product = await Product.findById(req.params.id)
        if(data.name) product.name = data.name
        if(data.info) product.info = data.info
        if(data.cost != undefined) product.cost = data.cost
        if(data.img_name) product.img_name = data.img_name
        await product.save()
        res.send(product)
    }catch (err) {
        res.status(400).send({message:"Something went wrong."})
    }
})

productRouter.delete('/:id', verifyToken, authorize(["admin"]), async(req,res)=>{
    try{
        const product = await Product.findById(req.params.id)
        await product.delete()
        res.send(product)
    }catch (err) {
        res.status(400).send({message:"Something went wrong."})
    }
})

module.exports = productRouter