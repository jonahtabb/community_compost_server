
module.exports = (sequelize, DataTypes) => {

    const UserModel = sequelize.define("User", {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password_hash: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    })

    return UserModel
}