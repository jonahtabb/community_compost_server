const { Sequelize } = require('sequelize')

const dialectOptions = 
    process.env.ENVIRONMENT === 'production'
    ?
    {
        ssl: {
            require: process.env.ENVIRONMENT === 'production',
            rejectUnauthorized: false
        }
    }
    : ''

const PASS = 
    process.env.ENVIRONMENT === 'production'
    ?   encodeURIComponent(process.env.DB_PASS)
    :   process.env.DB_PASS

const sequelize = new Sequelize(
    process.env.DB_DBNAME,
    process.env.DB_USER,
    PASS,
    {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        dialectOptions   
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