const fs = require('fs');
const db = require('./db.json')
const bcrypt = require('bcrypt')

const User = require('./models/userModel')
const Product = require('./models/productModel')

const initialDatabase = async ()=>{
    const users = await User.find({})
    if(!users.length){
        const asyncUsersRes = await Promise.all(db.users.map(async (u) => {
            bcrypt.hash(u.password, 10, async(err, hash)=>{
                if(hash){
                    u.password = hash
                    const user = new User(u)
                    await user.save()
                }
            })
        }));
        const asyncProductsRes = await Promise.all(db.products.map(async (p) => {
            const product = new Product(p)
            await product.save()
        }));
        console.log("DB Intialization successful")
    }
}

module.exports = { initialDatabase }
