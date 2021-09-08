require('dotenv').config()
const Express = require("express");
const controllers = require('./controllers');
const app = Express();
const { sequelize, syncDb } = require("./db")

startApp = async () => {
    
    app.use(Express.json())

    app.listen(3000, () => {
        console.log(`[Server]: App is listening on 3000.`);
    });
    
    syncDb(sequelize, {alter: true} )
    app.use("/member", controllers.memberController)


}

startApp()