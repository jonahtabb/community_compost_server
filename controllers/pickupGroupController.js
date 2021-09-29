const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs/dist/bcrypt")
const { PickupGroupModel, AdminModel, CommunityModel, MemberModel } = require('../models')
const { UniqueConstraintError } = require("sequelize/lib/errors");
const jwt = require("jsonwebtoken");
const validateJWT = require("../middleware/validate-jwt");

router.get('/test', (req, res) => {
    res.send("Testing the pickup group route")
})

//Admin Action: Create New Pickup Group
router.post('/create', validateJWT, async (req, res) => {
    const { id, is_admin } = req.user

    const { name, description, public_notes, start_time, end_time, day } = req.body.pickupGroup

    try {
        if (is_admin) {
            const admin = await AdminModel.findOne({ where: { UserId: id } })
            
            if (admin) {
                const community = await CommunityModel.findOne({ where: {AdminId: admin.id}})

                const newPickupGroup = await community.createPickupGroup({
                    name, description, public_notes, start_time, end_time, day
                })

                res.status(201).json({
                    message: "New Pickup Group Created",
                    newPickupGroup
                })

            } else throw "There is not admin profile associated with this user"
        } else throw "User is not administrator and cannot perform this action"
    } catch (error) {
        res.status(500).json({
            error
        })
    }
})

//Admin Action: Get All Pick-up Groups belonging to an admin user
router.get("/all", validateJWT, async (req, res) => {
    const { id, is_admin} = req.user
    try {
        if (is_admin) {
            const admin = await AdminModel.findOne({
                where: { UserId: id}
            })

            const community = await CommunityModel.findOne({
                where: { AdminId: admin.id}
            })

            const pickupGroups = await PickupGroupModel.findAll({
                where: {CommunityId: community.id}
            })

            res.status(201).json({
                message: "Admin Member's Groups Retrieved",
                pickupGroups
            })
        } else throw "User is not administrator and cannot perform this action";
    } catch (error) {
        res.status(500).json({
            error
        })
    }
})

//Member Action: Get Own Pickup Group
router.get("/my", validateJWT, async (req, res) => {
    const {id} = req.user
    try {
        const member = await MemberModel.findOne({
            where: {
                UserId: id,
            },
            include:{
                model: PickupGroupModel
            }
        })
        res.status(201).json({
            message: "Retrieved Pickup Group",
            pickupGroup: member.PickupGroup
        })
    } catch (error){
        res.status(500).json({error})
    }
})


module.exports = router