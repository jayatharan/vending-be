const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    img_name:{
        type:String,
        default:"default.png"
    },
    info:{
        type:String,
        default:""
    },
    cost:{
        type:Number,
        default:0.00
    }
})

const Product = mongoose.model('Product', productSchema)
module.exports = Product