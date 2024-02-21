import { getTestAuthen, logInController, logOutController, updateTokenController } from "../controller/AuthenController";
import { verifyToken } from "../middleware/authen";

const router = require("express").Router();

//Test
router.get('/', verifyToken, getTestAuthen);

//Login
router.get('/login', logInController);

//Create Account
// router.post('/createAcc', authController.createUser);

//Update Token Expired
router.post('/token', updateTokenController);

//Logout
router.post('/logout', logOutController);

module.exports = router;