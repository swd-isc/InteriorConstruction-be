import express from "express";
import { clientService } from "../controller/ClientController";
import { isAdmin, isCurrentUser, isCurrentUserOrAdmin, verifyToken } from "../middleware/authen";
import { accountService } from "../controller/AccountController";

const router = express.Router();

/**
 * @swagger
 *  components:
 *      schemas:
 *          Client:
 *            type: object
 *            properties:
 *              firstName:
 *                type: string
 *              lastName:
 *                type: string
 *              birthDate:
 *                type: string
 *              phone:
 *                type: string
 *              photoURL:
 *                type: string
 *              accountId:
 *                type: object
 *                properties:
 *                  email:
 *                    type: string
 *                  role:
 *                    type: string
 *                    enum:
 *                      - CLIENT
 *                      - ADMIN
 *                  status:
 *                    type: string
 *                    enum:
 *                      - ACTIVE
 *                      - INACTIVE
 *              contracts:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    furnitures:
 *                      type: array
 *                      items:
 *                        type: string
 *                    quantity:
 *                      type: number
 *                    contractPrice:
 *                      type: number
 *                    status:
 *                      type: string
 *                      enum:
 *                        - CANCEL
 *                        - PROCESSING
 *                        - SUCCESS
 *          ClientData:
 *            type: object
 *            properties:
 *              id:
 *                type: string
 *              firstName:
 *                type: string
 *              lastName:
 *                type: string
 *              birthDate:
 *                type: string
 *              phone:
 *                type: string
 *              photoURL:
 *                type: string
 *              accountId:
 *                type: object
 *                properties:
 *                  id:
 *                    type: string
 *                  email:
 *                    type: string
 *                  password:
 *                    type: string
 *                  role:
 *                    type: string
 *                    enum:
 *                      - CLIENT
 *                      - ADMIN
 *                  status:
 *                    type: string
 *                    enum:
 *                      - ACTIVE
 *                      - INACTIVE
 *              contracts:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    furnitures:
 *                      type: array
 *                      items:
 *                        type: string
 *                    contractPrice:
 *                      type: number
 *                    quantity:
 *                      type: number
 *                    status:
 *                      type: string
 *                      enum:
 *                        - CANCEL
 *                        - PROCESSING
 *                        - SUCCESS
 */

const ClientRouter = (app) => {
  /**
   * @swagger
   * /api/client:
   *  get:
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Clients
   *    summary: Get clients by page
   *    description: This is endpoint for getting clients by page
   *    parameters:
   *      - in: query
   *        name: page
   *        description: For pagination
   *        required: false
   *        schema:
   *          type: number
   *    responses:
   *      200:
   *        description: Ok
   *        content:
   *          application/json:
   *            schema:
   *              type: array
   *              items:
   *                  type: object
   *                  properties:
   *                    status:
   *                      type: number
   *                    data:
   *                      type: object
   *                      properties:
   *                        clients:
   *                          type: array
   *                          items: 
   *                            type: object
   *                            properties:
   *                              _id:
   *                                type: string
   *                              firstName:
   *                                type: string
   *                              lastName:
   *                                type: string
   *                              birthDate:
   *                                type: string
   *                              phone:
   *                                type: string
   *                              photoURL:
   *                                type: string
   *                              contracts:
   *                                type: array
   *                                items:
   *                                  type: string
   *                              accountId:
   *                                type: object
   *                                properties:
   *                                  id:
   *                                    type: string
   *                                  email:
   *                                    type: string
   *                                  role:
   *                                    type: string
   *                                    enum:
   *                                      - CLIENT
   *                                      - ADMIN
   *                                  status:
   *                                    type: string
   *                        page:
   *                          type: number
   *                        totalPages:
   *                          type: number
   *                    message:
   *                      type: string
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
   *      401:
   *           description: Unauthorized
   *           content:
   *                application/json:
   *                    schema:
   *                        type: string
   *      403:
   *           description: Forbidden
   *           content:
   *                application/json:
   *                    schema:
   *                        type: object
   *                        properties:
   *                            messageError:
   *                                type: string 
   */
  router.get("/", verifyToken, isAdmin, clientService.getClients);

  /**
   * @swagger
   * /api/client/{id}:
   *  get:
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Clients
   *    summary: Get client by id
   *    description: This is endpoint for getting client by id
   *    parameters:
   *      - in: path
   *        name: id
   *        description: Id required
   *        required: true
   *        schema:
   *          type: string
   *    responses:
   *      200:
   *        description: Ok
   *        content:
   *          application/json:
   *            schema:
   *              type: array
   *              items:
   *                  type: object
   *                  properties:
   *                    status:
   *                      type: number
   *                    data:
   *                      type: object
   *                      properties:
   *                        clients:
   *                          $ref: '#components/schemas/Client'
   *                        page:
   *                          type: number
   *                        totalPages:
   *                          type: number
   *                    message:
   *                      type: string
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
   *      401:
   *           description: Unauthorized
   *           content:
   *                application/json:
   *                    schema:
   *                        type: string
   *      403:
   *           description: Forbidden
   *           content:
   *                application/json:
   *                    schema:
   *                        type: object
   *                        properties:
   *                            messageError:
   *                                type: string 
   */
  router.get("/:id", verifyToken, isCurrentUserOrAdmin, clientService.getClientById);

  // router.post("/", clientService.createClient); //Unused

  /**
    * @swagger
    * /api/client/ad/{accountId}:
    *  put:
    *    security:
    *      - bearerAuth: []
    *    tags:
    *      - Clients
    *    summary: Admin update account by account Id
    *    description: This endpoint is for admin updating account by account Id
    *    parameters:
    *      - in: path
    *        name: accountId
    *        required: true
    *        description: Account ID required
    *        schema:
    *          type: string
    *    requestBody:
    *       required: true
    *       content:
    *           application/json:
    *               schema:
    *                   type: object
    *                   properties:
    *                     status:
    *                       type: string
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
    *      401:
    *           description: Unauthorized
    *           content:
    *                application/json:
    *                    schema:
    *                        type: string
    *      403:
    *           description: Forbidden
    *           content:
    *                application/json:
    *                    schema:
    *                        type: object
    *                        properties:
    *                            messageError:
    *                                type: string 
    */
  router.put("/ad/:accountId", verifyToken, isAdmin, accountService.updateAccountByAdmin);
  router.put("/ad/", verifyToken, isAdmin, accountService.updateAccountByAdmin);

  /**
    * @swagger
    * /api/client/{id}:
    *  put:
    *    security:
    *      - bearerAuth: []
    *    tags:
    *      - Clients
    *    summary: Update information client by Id
    *    description: This endpoint is for client updating information by client Id
    *    parameters:
    *      - in: path
    *        name: id
    *        required: true
    *        description: Id required
    *        schema:
    *          type: string
    *    requestBody:
    *       required: false
    *       content:
    *           application/json:
    *               schema:
    *                   type: object
    *                   properties:
    *                     firstName:
    *                       type: string
    *                     lastName:
    *                       type: string
    *                     birthDate:
    *                       type: string
    *                     phone:
    *                       type: string
    *                     photoURL:
    *                       type: string
    *                     password:
    *                       type: string
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
    *      401:
    *           description: Unauthorized
    *           content:
    *                application/json:
    *                    schema:
    *                        type: string
    *      403:
    *           description: Forbidden
    *           content:
    *                application/json:
    *                    schema:
    *                        type: object
    *                        properties:
    *                            messageError:
    *                                type: string 
    */
  router.put("/:id", verifyToken, isCurrentUser, clientService.updateClient);
  router.put("/", verifyToken, isCurrentUser, clientService.updateClient);

  // router.delete("/:id", verifyToken, clientService.deleteClient); //Unused
  // router.delete("/", verifyToken, clientService.deleteClient); //Unused

  return app.use("/api/client", router);
};

export { ClientRouter };
