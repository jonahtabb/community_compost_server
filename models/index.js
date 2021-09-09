//Grab db instance
const {sequelize, syncDb} = require('../db')
const { DataTypes } = require('sequelize')

//Grab Model Functions
const DefineUserModel = require('./User')
const UserModel = DefineUserModel(sequelize, DataTypes)

const DefineMember = require('./Member')
const Member = DefineMember(sequelize, DataTypes)


//Define Associations Here

//Sync
syncDb(sequelize, {force: true})

module.exports = { 
    UserModel, 
    Member 
}

