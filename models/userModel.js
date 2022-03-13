const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    role:{
        type:String,
        enum:["customer","admin"],
        default:"customer"
    },
    password:{
        type:String,
        required:true
    }
})

userSchema.set('toJSON',{
    virtuals:true,
    versionKey:false,
    transform: function(doc, ret){
        delete ret.password
    }
})

const User = mongoose.model("User", userSchema)
module.exports = User