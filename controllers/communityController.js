const router = require("express").Router();
const { UniqueConstraintError } = require("sequelize/lib/errors");
const { CommunityModel, AdminModel, UserModel } = require("../models");
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
router.get("/all", validateJWT, async (req, res) => {
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

module.exports = router;
