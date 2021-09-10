
module.exports = (sequelize, DataTypes) => {

    const Admin = sequelize.define("Admin", {
        first_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false
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