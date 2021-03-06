const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs/dist/bcrypt");
const { UserModel } = require("../models");
const { UniqueConstraintError } = require("sequelize/lib/errors");
const jwt = require("jsonwebtoken");
const validateJWT = require("../middleware/validate-jwt");

//Test User Route
router.get("/test", (req, res) => {
    res.send("Testing the User Route");
});

//Register New User
router.post("/register", async (req, res) => {
    console.log("HIT USER REGISTER ROUTE", req.body.user);
    const { email, password, is_admin, first_name, last_name } = await req.body
        .user;

    try {
        const user = await UserModel.create({
            email,
            password_hash: bcrypt.hashSync(password, 13),
            is_admin: is_admin,
            first_name,
            last_name,
        });
        console.log(user);
        let token = jwt.sign(
            {
                id: user.id,
                is_admin: user.is_admin,
            },
            process.env.JWT_SECRET,
            { expiresIn: "14d" }
        );

        res.status(201).json({
            message: "User successfully registered",
            user: user,
            sessionToken: token,
        });
    } catch (error) {
        if (error instanceof UniqueConstraintError) {
            res.status(409).json({
                message: "Email address already in use",
            });
        } else {
            res.status(500).json({
                message: "Failed to register user",
            });
            console.log({ error });
        }
    }
});

//User Login
router.post("/login", async (req, res) => {
    let { email, password } = req.body.user;

    try {
        const loginUser = await UserModel.findOne({
            where: {
                email: email,
            },
        });

        if (loginUser) {
            let passwordCompare = await bcrypt.compare(
                password,
                loginUser.password_hash
            );
            if (passwordCompare) {
                let token = jwt.sign(
                    {
                        id: loginUser.id,
                        is_admin: loginUser.is_admin,
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: "14d" }
                );

                res.status(200).json({
                    user: loginUser,
                    message: "User successfully logged in!",
                    sessionToken: token,
                });
            } else {
                res.status(401).json({
                    message: "Incorrect email or password",
                });
            }
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to log user in",
            error,
        });
    }
});

//Delete OWN User (Currently only available for Members)
router.delete("/delete", validateJWT, async (req, res) => {
    const { id } = req.user;
    console.log(id);
    try {
        let deleted = UserModel.destroy({
            where: { id: id },
        });

        res.status(200).json({
            message: "User successfully deleted",
            removedUser: deleted,
        });
    } catch (error) {
        res.status(500).json({ error });
    }
});

//Get OWN User Data
router.get("/me", validateJWT, async (req, res) => {
    try {
        const { id } = req.user;
        let user = await UserModel.findOne({
            where: { id },
        });

        res.status(200).json({
            message: "User Data Successfully Fetched",
            userData: user,
        });
    } catch (error) {
        res.status(500).json({ error });
    }
});

//Update OWN user
router.put("/update", validateJWT, async (req, res) => {
    const { id } = req.user;
    const { email, first_name, last_name, registration_complete } =
        req.body.user;

    try {
        foundUser = await UserModel.update(
            {
                email,
                first_name,
                last_name,
                registration_complete,
            },
            {
                where: { id: id },
            }
        );
        res.status(200).json({
            message: "User Data Successfully Updated",
            userData: foundUser,
        });
    } catch (error) {
        res.status(500).json({ error });
    }
});

module.exports = router;
