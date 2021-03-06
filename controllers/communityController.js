const router = require("express").Router();
const { UniqueConstraintError } = require("sequelize/lib/errors");
const {
    CommunityModel,
    AdminModel,
    UserModel,
    MemberModel,
} = require("../models");
const validateJWT = require("../middleware/validate-jwt");

router.get("/test", validateJWT, (req, res) => {
    res.send("Testing This route!");
    console.log(req.user.is_admin);
});

//Admin Action: Create New Community
router.post("/create", validateJWT, async (req, res) => {
    try {
        const { id, is_admin } = req.user;

        const { name, description } = req.body.community;

        if (is_admin) {
            const admin = await AdminModel.findOne({ where: { UserId: id } });

            if (admin) {
                const adminAlreadyHasCommunity = await CommunityModel.findOne({
                    where: {
                        AdminId: admin.id,
                    },
                });

                //Mark the registration as complete
                const user = await UserModel.findOne({ where: { id: id } });
                await user.update({
                    registration_complete: "1",
                });

                if (!adminAlreadyHasCommunity) {
                    const community = await CommunityModel.create({
                        name,
                        description,
                        AdminId: admin.id,
                    });
                    res.status(201).json({
                        message: "New Community Successfully Created",
                        community,
                    });
                } else
                    throw "Admin Already has a community associated with their profile";
            } else throw "There is not admin profile associated with this user";
        } else throw "User is not administrator and cannot perform this action";
    } catch (error) {
        res.status(500).json({
            error,
        });
    }
});

//Get All Communities
router.get("/all", async (req, res) => {
    try {
        const allCommunities = await CommunityModel.findAll();
        res.status(201).json({
            message: "All Communities Retrieved",
            allCommunities,
        });
    } catch (error) {
        res.status(500).json({
            error,
        });
    }
});

//Admin Action: Get OWN Community Profile
router.get("/me", validateJWT, async (req, res) => {
    const { id } = req.user;
    try {
        const userExtended = await UserModel.findOne({
            where: { id },
            include: { model: AdminModel },
        });
        const adminId = await userExtended.Admin.id;
        const communityProfile = await CommunityModel.findOne({
            where: { id: adminId },
        });
        res.status(201).json({
            message: "Retrieved Community Profile",
            communityProfile,
        });
    } catch (error) {
        res.status(500).json({ error });
    }
});

//Member Action: Get OWN Community Profile

router.get("/mymemberprofile", validateJWT, async (req, res) => {
    const { id } = req.user;
    try {
        const memberProfile = await MemberModel.findOne({
            where: {
                UserId: id,
            },
        });
        const communityProfile = await CommunityModel.findOne({
            where: { id: memberProfile.CommunityId },
        });
        res.status(201).json({
            message: "Retrieved Community Profile",
            communityProfile,
        });
    } catch (error) {
        res.status(500).json({ error });
    }
});

module.exports = router;
