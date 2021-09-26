const router = require("express").Router();
const { UniqueConstraintError } = require("sequelize/lib/errors");
const {
  MemberModel,
  CommunityModel,
  AdminModel,
  PickupGroupModel,
  UserModel,
} = require("../models");
const validateJWT = require("../middleware/validate-jwt");
const res = require("express/lib/response");

router.get("/test", (req, res) => {
  res.send("Testing This route!");
});

//Create Member Profile
router.post("/create", validateJWT, async (req, res) => {
  const { id } = req.user;
  const UserId = id;
  let {
    email_secondary,
    phone_primary,
    phone_primary_type,
    phone_secondary,
    phone_secondary_type,
    bio,
    location_name,
    location_address1,
    location_address2,
    location_city,
    location_zip,
    location_state,
    location_notes,
    CommunityId

  } = req.body.member;

  try {
    const profileAlreadyExists = await MemberModel.findOne({
      where: {
        UserId,
      },
    });

    if (!profileAlreadyExists) {
      const member = await MemberModel.create({
        email_secondary,
        phone_primary,
        phone_primary_type,
        phone_secondary,
        phone_secondary_type,
        bio,
        location_name,
        location_address1,
        location_address2,
        location_city,
        location_zip,
        location_state,
        location_notes,
        UserId,
        CommunityId
      });

      res.status(201).json({
        message: "Member Profile Successfully Created",
        member,
      });
    } else {
      throw "A member profile already exists for this user. Only one profile is allowed for each Member user";
    }
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      res.status(409).json({
        message: "Unique constraint error",
      });
    } else {
      res.status(500).json({
        message: "Failed to create member profile",
      });
      console.log(error);
    }
  }
});

//Member Action: Update Member's Own Profile
router.put("/me/update", validateJWT, async (req, res) => {
  const { id } = req.user;
  const UserId = id;
  let {
    email_secondary,
    phone_primary,
    phone_primary_type,
    phone_secondary,
    phone_secondary_type,
    bio,
    location_name,
    location_address1,
    location_address2,
    location_city,
    location_zip,
    location_state,
    location_notes,
    CommunityId

  } = req.body.member;

  try {

      const member = await MemberModel.update(
      {
        email_secondary,
        phone_primary,
        phone_primary_type,
        phone_secondary,
        phone_secondary_type,
        bio,
        location_name,
        location_address1,
        location_address2,
        location_city,
        location_zip,
        location_state,
        location_notes,
        UserId,
        CommunityId
      }, {
        where: { UserId: id }
      })

      res.status(201).json({
        message: "Member Profile Successfully Updated",
      });
    
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      res.status(409).json({
        message: "Unique constraint error",
      });
    } else {
      res.status(500).json({
        message: "Failed to update member profile",
      });
      console.log(error);
    }
  }
});

//Member Action: Update Member OWN Community
router.put(
  "/updateowncommunity/:communityid",
  validateJWT,
  async (req, res) => {
    const { id } = req.user;
    const communityId = parseInt(req.params.communityid);

    try {
      const member = await MemberModel.findOne({
        where: { UserId: id },
      });

      const community = await CommunityModel.findOne({
        where: { id: communityId },
      });

      await member.setCommunity(community);

      res.status(200).json({
        message: `Member added to community with id ${communityId}`,
        member,
      });
    } catch (error) {
      res.status(500).json({ error });
    }
  }
);

//Member Action: Get Member's OWN Profile
router.get("/me", validateJWT, async (req, res) => {
  const { id } = req.user;
  try {
    const memberProfile = await MemberModel.findOne({
      where: {
        UserId: id,
      },
    });
    res.status(200).json({
      memberProfile,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

//Admin Action: View All Members of OWN Community
router.get("/all", validateJWT, async (req, res) => {
  const { id, is_admin } = req.user;
  try {
    if (is_admin) {
      const admin = await AdminModel.findOne({
        where: { UserId: id },
      });

      const community = await CommunityModel.findOne({
        where: { AdminId: admin.id },
      });

      const allMembers = await MemberModel.findAll({
        where: { CommunityId: community.id },
        include: [{model: UserModel}]
      });

      res.status(201).json({
        message: "All Community Members Retrieved",
        allMembers,
      });
    } else throw "User is not administrator and cannot perform this action";
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
});

//Admin Action: Assign Member to a Pickup Group
router.put("/addtogroup", validateJWT, async (req, res) => {
  const { is_admin } = req.user;
  const { groupId, userId } = req.body.addMemberToGroup;

  try {
    if (is_admin) {
      const member = await MemberModel.findOne({ where: { UserId: +userId } });
      const group = await PickupGroupModel.findOne({ where: { id: +groupId } });

      if (member && group) {
        await member.setPickupGroup(group);

        res.status(200).json({
          message: "Member added to group",
          groupDetails: {
            id: group.id,
            name: group.name,
            description: group.description,
          },
        });
      } else throw "Member or pickup group could not be found";
    } else throw "User is not administrator and cannot perform this action";
  } catch (error) {
    res.status(500).json({ error });
  }
});

//Admin Action: Remove Member from a Pickup Group
router.put("/removefromgroup", validateJWT, async (req, res) => {
  const { is_admin } = req.user;
  const { groupId, userId } = req.body.addMemberToGroup;

  try {
    if (is_admin) {
      const member = await MemberModel.findOne({ where: { UserId: +userId } });
      const group = await PickupGroupModel.findOne({ where: { id: +groupId } });

      if (member) {
        await await group.removeMember(member);

        res.status(200).json({
          message: "Member removed from group",
          groupDetails: {
            id: group.id,
            name: group.name,
            description: group.description,
          },
        });
      } else throw "Member could not be found";
    } else throw "User is not administrator and cannot perform this action";
  } catch (error) {
    res.status(500).json({ error });
  }
});

//Admin Action: Get All Members from a Pickup Group
router.get("/group/:id", validateJWT, async(req, res) => {
  const {is_admin} = req.user;
  const groupId = req.params.id
  try {
    if (is_admin) {
      const members = await MemberModel.findAll({
        where: {PickupGroupId: +groupId},
        include: [{
          model: UserModel,
        }]
      }

      )
      // console.log(await members)
      res.status(200).json({
        message: "Fetched all members from this pickup group",
        members
      })
    } else throw new Error ("User is not administrator and cannot perform this action")

  } catch (error) {
    res.status(500).json(error)
  }
})

module.exports = router;
