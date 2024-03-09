import express from "express";
import { accountService } from "../controller/AccountController";
import { isAdmin, verifyToken } from "../middleware/authen";

const router = express.Router();

/**
 * @swagger
 *  components:
 *      schemas:
 *          Account:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *              password:
 *                type: string
 *              role:
 *                type: string
 *              logInMethod:
 *                type: string
 *              status:
 *                type: string
 *              refreshToken:
 *                type: string
 *          AccountData:
 *            type: object
 *            properties:
 *              id:
 *                type: string
 *              email:
 *                type: string
 *              password:
 *                type: string
 *              role:
 *                type: string
 *              logInMethod:
 *                type: string
 *              status:
 *                type: string
 *              refreshToken:
 *                type: string
 */
const AccountRouter = (app) => {
  // router.get("/insert-sample-data", accountService.insertSampleData);

  /**
      * @swagger
      * /api/account:
      *  get:
      *      security:
      *           - bearerAuth: []
      *      tags:
      *           - Accounts
      *      summary: Get account by page
      *      description: This endpoint is for getting account by page
      *      parameters:
      *          - in: query
      *            name: page
      *            required: false
      *            description: For paging
      *            schema:
      *               type: number
      *          - in: query
      *            name: sort_by
      *            required: false
      *            description: For sorting
      *            schema:
      *               type: string
      *               enum:
      *                   - asc
      *                   - desc
      *      responses:
      *          200:
      *              description: OK
      *              content:
      *                   application/json:
      *                       schema:
      *                           type: object
      *                           properties:
      *                               status:
      *                                   type: number
      *                               data:
      *                                   type: object
      *                                   properties:
      *                                       accounts:
      *                                           type: array
      *                                           items:
      *                                              $ref: '#components/schemas/AccountData'
      *                                       page:
      *                                           type: number
      *                                       totalPages:
      *                                           type: number                                                                                                                                                                        
      *                               message:
      *                                   type: string
      *          400:
      *              description: Bad Request
      *              content:
      *                   application/json:
      *                       schema:
      *                           type: object
      *                           properties:
      *                               status:
      *                                   type: number
      *                               messageError:
      *                                   type: string
      *          500:
      *              description: Server error
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


  router.get("/", verifyToken, isAdmin, accountService.getAccounts);

  /**
  * @swagger
  * /api/account/{id}:
  *  get:
  *    security:
  *      - bearerAuth: []
  *    tags:
  *      - Accounts
  *    summary: Get account by Id
  *    description: This endpoint is for getting account by Id
  *    parameters:
  *      - in: path
  *        name: id
  *        required: true
  *        description: Id required
  *        schema:
  *          type: string
  *    responses:
  *      200:
  *        description: Ok
  *        content:
  *          application/json:
  *            schema:
  *              type: object
  *              properties:
  *                status:
  *                  type: number
  *                data:
  *                  $ref: '#components/schemas/AccountData'
  *                message:
  *                  type: string
  *      400:
  *        description: Bad request
  *        content:
  *          application/json:
  *            schema:
  *              type: object
  *              properties:
  *                status:
  *                  type: number
  *                data:
  *                  type: object
  *                messageError:
  *                  type: string
  *      500:
  *        description: Server error
  *        content:
  *          application/json:
  *            schema:
  *              type: object
  *              properties:
  *                status:
  *                  type: number
  *                messageError:
  *                  type: string
  */
  router.get("/:id", verifyToken, isAdmin, accountService.getAccountById);


  router.post("/", verifyToken, isAdmin, accountService.createAccount);

  router.put("/:id", verifyToken, isAdmin, accountService.updateAccountByAdmin);
  router.put("/", verifyToken, isAdmin, accountService.updateAccountByAdmin);

  router.delete("/:id", verifyToken, isAdmin, accountService.deleteAccount);
  router.delete("/", verifyToken, isAdmin, accountService.deleteAccount);

  return app.use("/api/account", router);
};

export { AccountRouter };
