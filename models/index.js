//Grab db instance
const {sequelize, syncDb} = require('../db')
const { DataTypes } = require('sequelize')

//Grab Model Functions
const DefineUser = require('./User')
const DefineMember = require('./Member')

const User = DefineUser(sequelize, DataTypes)
const Member = DefineMember(sequelize, DataTypes)


//Define Associations Here

//Sync
syncDb(sequelize, {force: true})

module.exports = { 
    User, 
    Member 
}

