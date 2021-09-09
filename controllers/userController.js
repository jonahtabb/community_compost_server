const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs/dist/bcrypt")
const { User } = require('../models')
const { UniqueConstraintError } = require("sequelize/lib/errors");
const jwt = require("jsonwebtoken");


//Test User Route
router.get('/test', (req, res) => {
    res.send("Testing the User Route")
})

//Register New User
router.post("/register", async (req, res) => {
    console.log("HIT USER REGISTER ROUTE", req.body.user)
    let { email, password, type } = req.body.user;
    
    try {
        const user = await User.create({
            email,
            password_hash: bcrypt.hashSync(password, 13),
            user_type: type
        })
        console.log(user)
        let token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '14d'});

        res.status(201).json({
            message: "User successfully registered",
            user: user,
            sessionToken: token
        });
    } catch (error) {
        if (error instanceof UniqueConstraintError) {
            res.status(409).json({
                message: "Email address already in use"
            })
        } else {
            res.status(500).json({
                message: "Failed to register user",
            })
            console.log({error})
        }
    }
})

module.exports = router