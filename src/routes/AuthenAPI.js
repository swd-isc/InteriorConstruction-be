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
    /**
     * @swagger
     * /api/authen/register:
     *  post:
     *      summary: Register endpoint
     *      description: This endpoint is for registing an account
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
     *          201:
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
     *                                      firstName:
     *                                          type: string
     *                                      lastName:
     *                                          type: string
     *                                      birthDate:
     *                                          type: string
     *                                      phone:
     *                                          type: string
     *                                      photoURL:
     *                                          type: string
     *                                      accountId:
     *                                          type: string
     *                                      contracts:
     *                                          type: array
     *                                      _id:
     *                                          type: string
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
     *                              data:
     *                                  type: object
     *                              messageError:
     *                                  type: string
     */
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
     *                              accessToken:
     *                                  type: string
     *                              refreshToken:
     *                                  type: string
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
    /**
     * @swagger
     * /api/authen/token:
     *  post:
     *      summary: Update refresh token endpoint
     *      description: This endpoint is for updating refresh token
     *      tags:
     *          - Authen
     *      requestBody:
     *          required: true
     *          content:
     *              application/json:
     *                  schema:
     *                      type: object
     *                      properties:
     *                          refreshToken:
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
     *                              accessToken:
     *                                  type: string
     *                              refreshToken:
     *                                  type: string
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
     *          403:
     *              description: Forbidden
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              status:
     *                                  type: number
     *                              error:
     *                                  type: string
     *                              messageError:
     *                                  type: string
     */
    router.post('/token', authenController.updateTokenController);

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