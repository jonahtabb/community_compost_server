//Grab db instance
const {sequelize, syncDb} = require('../db')
const { DataTypes } = require('sequelize')

//Grab Model Functions
const DefineUser = require('./User')
const DefineMember = require('./Member')
const DefineAdmin = require('./Admin')

const UserModel = DefineUser(sequelize, DataTypes)
const MemberModel = DefineMember(sequelize, DataTypes)
const AdminModel = DefineAdmin(sequelize, DataTypes)

//Define Associations Here
UserModel.hasOne(MemberModel)
MemberModel.belongsTo(UserModel)

UserModel.hasOne(AdminModel)
AdminModel.belongsTo(UserModel)


//Sync
syncDb(sequelize, {alter: true})

module.exports = { 
    UserModel, 
    MemberModel,
    AdminModel
}

