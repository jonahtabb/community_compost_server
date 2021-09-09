require('dotenv').config()
const Express = require("express");
const controllers = require('./controllers');
const app = Express();

startApp = async () => {
    
    app.use(Express.json())

    app.listen(3000, () => {
        console.log(`[Server]: App is listening on 3000.`);
    });
    
    app.use("/member", controllers.memberController)
    app.use("/user", controllers.userController)


}

startApp()