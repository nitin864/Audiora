const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

async function registerUser(req, res) {
    try {

        const { username, email, password, role="user" } = req.body;

        const isUserAlreadyExist = await userModel.findOne({
            $or:[
                {username: username},
                {email: email}
            ]
        })

      

        if(isUserAlreadyExist){
            return res.status(409).json({
                message: "user already exist"
            })
        }

        const hash = await bcrypt.hash(password, 10)

        const user = await userModel.create({
            username,
            email,
            password: hash,
            role

        })

        const token = jwt.sign({
            id: user._id,
            role: user.role
        }, process.env.JWT_SECRET)

        res.cookie("token", token)

        res.status(201).json({
            message: "new user created successfully",
            user: user
        })
    }catch(error)
    {
        console.log(error)
    }


}

async function loginUser(req,res){
    const {username, email, password} = req.body;

    const user = await userModel.findOne({
        $or: [
            {username: username},
            {email: email}
        ]
    }); 

    if(!user){
        return res.status(401).json({
            message: "inavalid credentials"
        })
    }

    const isPassValid = await bcrypt.compare(password, user.password) 

    if(!isPassValid){
        return res.status(401).json({
            message: "invalid credentials"
        })
    }

    const token = jwt.sign({
        id: user._id,
        role: user.role
    }, process.env.JWT_SECRET);

    res.cookie("token", token)

    res.status(201).json({
        message: "user logged In successfully",
        user: user
    })
}

module.exports = { registerUser , loginUser}