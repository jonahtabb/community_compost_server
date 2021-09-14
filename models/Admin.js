
module.exports = (sequelize, DataTypes) => {

    const Admin = sequelize.define("Admin", {
        email_secondary: {
            type: DataTypes.STRING,
            allowNull: true
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone_type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        bio: {
            type: DataTypes.STRING(500),
            allowNull: true
        }
    })
    return Admin
}