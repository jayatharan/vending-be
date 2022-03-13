const mongoose = require('mongoose')
const Schema = mongoose.Schema

const cartItemScheama = new Schema({
    name:{
        type:String
    },
    img_name:{
        type:String
    },
    info:{
        type:String
    },
    cost:{
        type:Number
    },
    quantity:{
        type:Number
    }
})

const orderSchema = new Schema({
    totalQty:{
        type:Number,
        default:0
    },
    totalCost:{
        type:Number,
        default:0
    },
    cartItems:{
        type:[cartItemScheama],
        default:[]
    }
})

const Order = mongoose.model('Order', orderSchema)
module.exports = Order