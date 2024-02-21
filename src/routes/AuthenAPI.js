import { authenController } from "../controller/AuthenController";
import { verifyToken } from "../middleware/authen";

const router = require("express").Router();

//Test
router.get('/', verifyToken, authenController.getTestAuthen);

//Login
router.get('/register', authenController.registerController);

//Login
router.get('/login', authenController.logInController);

//Create Account
// router.post('/createAcc', authenController.createUser);

//Update Token Expired
router.get('/token', authenController.updateTokenController);

//Logout
router.get('/logout', authenController.logOutController);

module.exports = router;