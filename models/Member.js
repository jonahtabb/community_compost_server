const { STRING } = require("sequelize/types")

module.exports = (sequelize, DataTypes) => {

    const Member = sequelize.define("Member", {

            email_secondary: {
                type: DataTypes.STRING,
                allowNull: true
            },
            phone_primary: {
                type: DataTypes.STRING,
                allowNull: false
            },
            phone_primary_type: {
                type: DataTypes.STRING,
                allowNull: false
            },
            phone_secondary: {
                type: DataTypes.STRING,
                allowNull: true
            },
            phone_secondary_type: {
                type: DataTypes.STRING,
                allowNull: true
            },
            bio: {
                type: DataTypes.STRING(500),
                allowNull: true
            },
            locationName: {
                type: DataTypes.STRING,
            },
            locationAddress1: {
                type: DataTypes.STRING
            },
            locationAddress2: {
                type: DataTypes.STRING
            },
            locationCity: {
                type: DataTypes.STRING
            },
            locationZip: {
                type: DataTypes.STRING
            },
            locationState: {
                type: DataTypes.STRING
            }
        })
    
    return Member

}