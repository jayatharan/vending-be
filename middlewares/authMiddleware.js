const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const verifyToken = ( req, res, next)=>{
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        req.userData = decoded;
        next()
    } catch (error) {
        return res.status(401).send({message: "Your session is not valid."})
    }
}

const verifyRefreshToken = (req, res, next)=> {
    const token = req.body.token;
    if(token === null) return res.status(401).json({ message: "Invalid request." })
    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        req.userData = decoded
        next()
    } catch (error) {
        return res.status(401).send({message: "Your session is not valid."})
    }
}

const authorize = (roles = []) => {
    return ( req, res, next ) => {
        User.findById(req.userData.sub)
        .then((user)=>{
            if(roles.includes(user.role)){
                return next()
            }
            return res.status(401).json({ message: "You Dont Have Access To Make Change Here." });
        })
        .catch ((error)=>{
            return res.status(401).json({ message: "You Dont Have Access To Make Change Here." });
        })
    }
}

module.exports = {
    verifyRefreshToken,
    verifyToken,
    authorize
}