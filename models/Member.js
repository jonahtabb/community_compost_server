
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
            location_name: {
                type: DataTypes.STRING,
            },
            location_address1: {
                type: DataTypes.STRING
            },
            location_address2: {
                type: DataTypes.STRING
            },
            location_city: {
                type: DataTypes.STRING
            },
            location_zip: {
                type: DataTypes.STRING
            },
            location_state: {
                type: DataTypes.STRING
            }
        })
    
    return Member

}