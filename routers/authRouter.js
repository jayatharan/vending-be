const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

const {
    verifyToken,
    verifyRefreshToken 
} = require('../middlewares/authMiddleware') 

const User = require('../models/userModel')

const authRouter = express.Router()

authRouter.post('/register', async (req, res)=>{
    try{
        const data = req.body
        if(data.username && data.email && data.password){
            const user = await User.findOne({"email":data.email})
            if(user != null){
                res.status(401).send({message:"Email Already Exists"})
            }
            bcrypt.hash(data.password, 10, async (err,hash)=>{
                if(hash){
                    data.password = hash
                    const new_user = new User(data)
                    await new_user.save()
                    const access_token = jwt.sign({sub: new_user._id}, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_TIME })
                    const refresh_token = jwt.sign({ sub: new_user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_TIME })
                    return res.send({"user":new_user, "token":{access_token, refresh_token}})
                }
                return res.status(400).json({message: "Something went wrong."}); 
            })
        }
    }catch (err){
        return res.status(400).json({message: "Something went wrong."}); 
    }
})

authRouter.post('/login', async(req,res)=>{
    try{
        const data = req.body
        if(data.email && data.password){
            const user = await User.findOne({"email":data.email})
            if(user != null){
                const hash = user.password
                bcrypt.compare(data.password, hash, async function(err, result) {
                    if(result == true){
                        const access_token = jwt.sign({sub: user._id}, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_TIME })
                        const refresh_token = jwt.sign({ sub: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_TIME })
                        return res.send({"user":user, "token":{access_token, refresh_token}})
                    }else{
                        return res.status(400).json({message: "Password not matched."});
                    }
                })
            }else{
                return res.status(400).json({message: "User not Found."});
            }
        }else{
            return res.status(400).json({message: "Email and Password is required."}); 
        }
    }catch (err){
        return res.status(400).json({message: "Something went wrong."}); 
    }
})

authRouter.post('/token', verifyRefreshToken, async(req,res)=>{
    try{
        const user_id = req.userData.sub;
        const user = await User.findById(user_id)
        const access_token = jwt.sign({sub: user._id}, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_TIME })
        const refresh_token = jwt.sign({ sub: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_TIME })
        return res.send({"user":user, "token":{access_token, refresh_token}})
    }catch (err){
        return res.status(400).json({message: "Something went wrong."}); 
    }
})

module.exports = authRouter