
module.exports = (sequelize, DataTypes) => {

    const User = sequelize.define("User", {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password_hash: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        user_type: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })

    return User
}