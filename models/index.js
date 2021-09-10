//Grab db instance
const {sequelize, syncDb} = require('../db')
const { DataTypes } = require('sequelize')

//Grab Model Functions
const DefineUser = require('./User')
const DefineMember = require('./Member')
const DefineAdmin = require('./Admin')
const DefineCommunity = require('./Community')

const UserModel = DefineUser(sequelize, DataTypes)
const MemberModel = DefineMember(sequelize, DataTypes)
const AdminModel = DefineAdmin(sequelize, DataTypes)
const CommunityModel = DefineCommunity(sequelize, DataTypes)

//Association Definitions Below

//One User can have one Member
UserModel.hasOne(MemberModel)
MemberModel.belongsTo(UserModel)

//One User can have one Admin
UserModel.hasOne(AdminModel)
AdminModel.belongsTo(UserModel, {
    foreignKey: {
        name: 'UserId',
        type: DataTypes.NUMBER,
        unique: true,
        allowNull: false
    }
})

//One Admin has one Community
AdminModel.hasOne(CommunityModel);
CommunityModel.belongsTo(AdminModel);


//Sync
syncDb(sequelize, {alter: true})

module.exports = { 
    UserModel, 
    MemberModel,
    AdminModel,
    CommunityModel
}

