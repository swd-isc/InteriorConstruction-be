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
    /**
     * @swagger
     * /api/authen/logout:
     *  post:
     *      summary: User sign out endpoint
     *      description: This endpoint is for user to sign out
     *      tags:
     *          - Authen
     *      requestBody:
     *          required: true
     *          content:
     *              application/json:
     *                  schema:
     *                      type: object
     *                      properties:
     *                          clientId:
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
     */
    router.post('/logout', authenController.logOutController);

    return app.use('/api/authen', router);
}

export {
    AuthenRouter
}