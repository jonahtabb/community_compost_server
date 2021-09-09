const router = require("express").Router()
const bcrypt = require("bcryptjs/dist/bcrypt")
const { UserModel } = require('../models')
const { UniqueConstraintError } = require("sequelize/lib/errors");


//Test User Route
router.get('/test', (req, res) => {
    res.send("Testing the User Route")
})

//Register New User
router.post("/register", async (req, res) => {
    console.log("HIT USER REGISTER ROUTE", req.body.user)
    let { email, password } = req.body.user;

    try {
        const User = await UserModel.create({
            email:"test",
            password: "testpass" 
            //bcrypt.hashSync(password, 13)
        });
        console.log(User)
        let token = jwt.sign({id: User.id}, process.env.JWT_SECRET, {expiresIn: '14d'});

        res.status(201).json({
            message: "User successfully registered",
            user: User,
            sessionToken: token
        });
    } catch (error) {
        if (error instanceof UniqueConstraintError) {
            res.status(409).json({
                message: "Email address already in use"
            })
        } else {
            res.status(500).json({
                message: "Failed to register user"
            })
        }
    }
})

module.exports = router