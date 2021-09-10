module.exports = (sequelize, DataTypes) => {
    const PickupGroup = sequelize.define("PickupGroup", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        },
        public_notes: {
            type: DataTypes.STRING,
            allowNull: true
        },
        start_time: {
            type: DataTypes.STRING,
            allowNull: true
        },
        end_time: {
            type: DataTypes.STRING,
            allowNull: true
        },
        day: {
            type: DataTypes.STRING,
            allowNull: true
        }
    })
    return PickupGroup
}