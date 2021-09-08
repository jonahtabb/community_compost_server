//Grab db instance
const {sequelize, syncDb} = require('../db')
const { DataTypes } = require('sequelize')

//Grab Model Functions
const DefineMember = require('./Member')
const Member = DefineMember(sequelize, DataTypes)

//Define Associations Here

//Sync
syncDb(sequelize, {alter: true})

module.exports = { Member }
