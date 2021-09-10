const express = require("express")
const router = express.Router()
const { UniqueConstraintError } = require("sequelize/lib/errors");
const { AdminModel } = require('../models')
const validateJWT = require('../middleware/validate-jwt');

router.get('/test', (req, res) => {
    res.send("Testing Admin Route!")
})

//Create Admin Profile
router.post('/create', validateJWT, async (req, res) => {
    console.log(req.user)
    const { id } = req.user;
    const UserId = id;
    const {
        first_name,
        last_name,
        phone,
        phone_type,
        bio
    } = req.body.admin

    try {

        const admin = await AdminModel.create({
            first_name,
            last_name,
            phone,
            phone_type,
            bio,
            UserId
        })

        res.status(201).json({
            message: "Admin Profile Successfully Created",
            admin
        })
    } catch (error) {
        if (error instanceof UniqueConstraintError) {
            res.status(409).json({
                message: "Unique constraint error"
            })
        } else {
            res.status(500).json({
                message: "Failed to create member profile"
            })
            console.log(error)
        }
    }
})

module.exports = router