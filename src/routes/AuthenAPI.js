import { authenController } from "../controller/AuthenController";
import { verifyToken } from "../middleware/authen";

/**
 * @swagger
 *  components:
 *      securitySchemes:
 *          bearerAuth:
 *              type: http
 *              scheme: bearer
 *              bearerFormat: JWT
 */

const AuthenRouter = (app) => {
    const router = require("express").Router();

    //Login
    router.post('/register', authenController.registerController);

    //Login
    router.post('/login', authenController.logInController);

    //Update Token Expired
    router.get('/token', authenController.updateTokenController);

    //Logout
    router.get('/logout', authenController.logOutController);

    //Test
    /**
     * @swagger
     * /api/authen:
     *  get:
     *      security:
     *          - bearerAuth: []
     *      responses:
     *          200:
     *              description: Ok
     *          401:
     *              description: Unauthorized
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: string
     *          403:
     *              description: Forbidden
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              error:
     *                                  type: string
     *                              messageError:
     *                                  type: string
     */
    router.get('/', verifyToken, authenController.getTestAuthen);
    return app.use('/api/authen', router);
}

export {
    AuthenRouter
}