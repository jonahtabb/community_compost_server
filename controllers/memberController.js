const router = require("express").Router()
const { UniqueConstraintError } = require("sequelize/lib/errors");
const { MemberModel } = require('../models')
const validateJWT = require('../middleware/validate-jwt')

router.get('/test', (req, res) => {
    res.send("Testing This route!")
})

//Create Member Profile
router.post('/create', validateJWT, async (req, res) => {
    const { id } = req.user;
    const UserId = id;
    let {first_name, last_name, email_secondary, phone_primary, phone_primary_type, phone_secondary, phone_secondary_type, bio} = req.body.member

    try {
        const member = await MemberModel.create({
            first_name, 
            last_name,
            email_secondary,
            phone_primary,
            phone_primary_type,
            phone_secondary,
            phone_secondary_type,
            bio,
            UserId
        })

        res.status(201).json({
            message: "Member Profile Successfully Created",
            member
        })
    }
    catch (error) {
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

//Get Member's OWN Profile
router.get("/myprofile", validateJWT, async (req, res) => {
    const { id } = req.user;
    try {
        const memberProfile = await MemberModel.findOne({
            where: {
                UserId: id
            }
        })
        res.status(200).json({
            memberProfile   
        })
    } catch (error) {
        res.status(500).json({error})
    }
})

module.exports = router