
module.exports = (sequelize, DataTypes) => {

    const Member = sequelize.define("User", {
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            password_hash: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            first_name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            last_name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            email_primary: {
                type: DataTypes.STRING,
                allowNull: false
            },
            email_secondary: {
                type: DataTypes.STRING,
                allowNull: true
            },
            phone_primary: {
                type: DataTypes.STRING,
                allowNull: false
            },
            phone_primary_type: {
                type: DataTypes.ENUM('Mobile', 'Home', 'Office'),
                allowNull: false
            },
            phone_secondary: {
                type: DataTypes.STRING,
                allowNull: true
            },
            phone_secondary_type: {
                type: DataTypes.ENUM('Mobile', 'Home', 'Office'),
                allowNull: true
            },
            bio: {
                type: DataTypes.STRING(500),
                allowNull: true
            }
        })
    
    return Member

}