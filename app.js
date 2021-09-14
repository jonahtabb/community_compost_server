require('dotenv').config()
const express = require("express");
const controllers = require('./controllers');
const app = express();
const cors = require('cors')

startApp = async () => {
    
    app.use(express.json())
    //See cors configuration options here: https://www.npmjs.com/package/cors
    app.use(cors())
    app.options('*', cors())
    app.use("/user", controllers.userController)
    app.use("/member", controllers.memberController)
    app.use("/admin", controllers.adminController)
    app.use("/community", controllers.communityController)
    app.use("/group", controllers.pickupGroupsController)
    
    app.listen(process.env.PORT, () => {
        console.log(`[Server]: App is listening on ${process.env.PORT}.`);
    });
}

startApp()