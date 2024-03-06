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

    //Register
    router.post('/register', authenController.registerController);

    //Login
    /**
     * @swagger
     * /api/authen/login:
     *  post:
     *      summary: Login endpoint
     *      description: This endpoint is for logging in
     *      tags:
     *          - Authen
     *      requestBody:
     *          required: true
     *          content:
     *              application/json:
     *                  schema:
     *                      type: object
     *                      properties:
     *                          email:
     *                              type: string
     *                          password:
     *                              type: string
     *      responses:
     *          200:
     *              description: Ok
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              status:
     *                                  type: number
     *                              data:
     *                                  type: object
     *                                  properties:
     *                                      client:
     *                                          type: object
     *                                          properties:
     *                                              id:
     *                                                  type: string
     *                                              firstName:
     *                                                  type: string
     *                                              lastName:
     *                                                  type: string
     *                                              birthday:
     *                                                  type: string
     *                                              phone:
     *                                                  type: string
     *                                              photoURL:
     *                                                  type: string
     *                                              accountId:
     *                                                  type: object
     *                                                  properties:
     *                                                      id:
     *                                                          type: string
     *                                                      email:
     *                                                          type: string
     *                                                      role:
     *                                                          type: string
     *                                                      logInMethod:
     *                                                          type: string
     *                                                      status:
     *                                                          type: string
     *                                      tokens:
     *                                          type: object
     *                                          properties:
     *                                              accessToken:
     *                                                  type: string
     *                                              refreshToken:
     *                                                  type: string
     *                              message:
     *                                  type: string
     *          400:
     *              description: Bad request
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              status:
     *                                  type: number
     *                              messageError:
     *                                  type: string
     *          401:
     *              description: Unauthorized
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              status:
     *                                  type: number
     *                              messageError:
     *                                  type: string
     */
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
     *      summary: Testing authen
     *      description: This endpoint is for testing authen
     *      tags:
     *          - Authen
     *      parameters:
     *          - in: query
     *            name: page
     *            description: For pagination
     *            required: false
     *            schema:
     *              type: number
     *      responses:
     *          200:
     *              description: Ok
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: array
     *                          items:
     *                              type: object
     *                              properties:
     *                                  status:
     *                                      type: number
     *                                  data:
     *                                      type: object
     *                                      properties:
     *                                          clients:
     *                                              $ref: '#components/schemas/Client'
     *                                          page:
     *                                              type: number
     *                                          totalPages:
     *                                              type: number
     *                                  message:
     *                                      type: string
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