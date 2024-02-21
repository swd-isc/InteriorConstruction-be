import { authenController } from "../controller/AuthenController";
import { verifyToken } from "../middleware/authen";

const AuthenRouter = (app) => {
    const router = require("express").Router();

    //Login
    router.post('/register', authenController.registerController);

    //Login
    router.get('/login', authenController.logInController);

    //Create Account
    // router.post('/createAcc', authenController.createUser);

    //Update Token Expired
    router.get('/token', authenController.updateTokenController);

    //Logout
    router.get('/logout', authenController.logOutController);

    //Test
    router.get('/', verifyToken, authenController.getTestAuthen);
    return app.use('/api/authen', router);
}

export {
    AuthenRouter
}