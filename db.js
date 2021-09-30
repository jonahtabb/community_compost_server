const { Sequelize } = require('sequelize')

const sequelize = new Sequelize(
    process.env.DB_DBNAME,
    process.env.DB_USER,
    encodeURIComponent(process.env.DB_PASS),
    {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        ssl: process.env.ENVIRONMENT === 'production'
    }
)
console.log('************', process.env.ENVIRONMENT)

async function syncDb(sequelize, options){
    console.info('************', process.env.ENVIRONMENT)
    const {force, alter} = options
    try {
        if (force){
            await sequelize.sync({force: true})
        } else if (alter) {
            await sequelize.sync({alter: true})
        } else {
            await sequelize.sync()
        }
    } catch(error){
        console.log({error})
    }
}

module.exports = {
    sequelize,
    syncDb
}