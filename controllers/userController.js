const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs/dist/bcrypt")
const { UserModel } = require('../models')
const { UniqueConstraintError } = require("sequelize/lib/errors");
const jwt = require("jsonwebtoken");


//Test User Route
router.get('/test', (req, res) => {
    res.send("Testing the User Route")
})

//Register New User
router.post("/register", async (req, res) => {
    console.log("HIT USER REGISTER ROUTE", req.body.user)
    let { email, password, is_admin } = await req.body.user;
    
    try {
        const user = await UserModel.create({
            email,
            password_hash: bcrypt.hashSync(password, 13),
            is_admin: is_admin
        })
        console.log(user)
        let token = jwt.sign({
            id: user.id, 
            is_admin: user.is_admin
        }, process.env.JWT_SECRET, {expiresIn: '14d'});

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

//User Login
router.post('/login', async(req, res) => {
    let { email, password } = req.body.user

    try {
        const loginUser = await UserModel.findOne({
            where: {
                email: email
            }
        })
        
        if(loginUser) {
            
            let passwordCompare = await bcrypt.compare(password, loginUser.password_hash);
            if (passwordCompare) {
                let token = jwt.sign({
                    id: loginUser.id, 
                    is_admin: loginUser.is_admin
                }, process.env.JWT_SECRET, {expiresIn: '14d'});

                res.status(200).json({
                    user: loginUser,
                    message: "User successfully logged in!",
                    sessionToken: token
                });
            } else {
                res.status(401).json({
                    message: "Incorrect email or password"
                })
            }
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to log user in",
            error
        })
    }
})

module.exports = router