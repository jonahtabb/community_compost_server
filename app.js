require('dotenv').config()
const express = require("express");
const controllers = require('./controllers');
const app = express();

startApp = async () => {
    
    app.use(express.json())
    
    app.use("/user", controllers.userController)
    app.use("/member", controllers.memberController)
    app.use("/admin", controllers.adminController)
    app.use("/community", controllers.communityController)

    app.listen(3000, () => {
        console.log(`[Server]: App is listening on 3000.`);
    });
}

startApp()