import express from "express";
import { contractService } from "../controller/ContractController";
import { isAdmin, isClient, isCurrentUser, isCurrentUserOrAdmin, verifyToken } from "../middleware/authen";

const router = express.Router();

/**
 * @swagger
 *  components:
 *      schemas:
 *          Contract:
 *              type: object
 *              properties:
 *                  contractPrice:
 *                      type: number
 *                  status:
 *                    type: string
 *                    enum:
 *                      - CANCEL
 *                      - PROCESSING
 *                      - SUCCESS  
 *          ContractData:
 *              type: object
 *              properties:
 *                  clientId:
 *                    type: string
 *                  furnitures:
 *                    type: array
 *                    items:
 *                      type: object
 *                      properties:
 *                        furnitureId:
 *                          type: string
 *                        quantity:
 *                          type: number
 *                  contractPrice:
 *                      type: number
 *                  contractFileURL:
 *                      type: string     
 *          ContractSchema:
 *            type: object
 *            properties:
 *              id:
 *                type: string
 *              furnitures:
 *                type: array
 *                items:
 *                    type: object
 *                    properties:
 *                      furnitureId:
 *                        type: string
 *                      count:
 *                        type: number
 *              designs:
 *                type: array
 *                items:
 *                    type: object
 *                    properties:
 *                      designId:
 *                        type: string
 *                      count:
 *                        type: number
 *              status:
 *                  type: string 
 *                  enum:
 *                   - CANCEL
 *                   - PROCESSING
 *                   - SUCCESS  
 */

const ContractRouter = (app) => {

  /**
  * @swagger
  * /api/contract:
  *  get:
  *      security:
  *           - bearerAuth: []
  *      tags:
  *           - Contracts
  *      summary: Admin get contracts
  *      description: This endpoint is for admin getting contracts
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
  *                                       contracts:
  *                                           type: array
  *                                           items:
  *                                              $ref: '#components/schemas/ContractData'
  *                                       id:
  *                                           type: string
  *                                       clientId:
  *                                           type: string
  *                                       designId:
  *                                           type: string
  *                                       contractPrice:
  *                                           type: number
  *                                       status:
  *                                           type: string                                                                                                                                                 
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
  *          401:
  *               description: Unauthorized
  *               content:
  *                    application/json:
  *                        schema:
  *                            type: string
  *          403:
  *               description: Forbidden
  *               content:
  *                    application/json:
  *                        schema:
  *                            type: object
  *                            properties:
  *                                messageError:
  *                                    type: string 
  */
  router.get("/", verifyToken, isAdmin, contractService.getContracts);

  /**
  * @swagger
  * /api/contract/client:
  *  get:
  *      security:
  *           - bearerAuth: []
  *      tags:
  *           - Contracts
  *      summary: Client get contracts
  *      description: This endpoint is for client getting contracts
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
  *                                       contracts:
  *                                           type: array
  *                                           items:
  *                                              $ref: '#components/schemas/ContractData'
  *                                       id:
  *                                           type: string
  *                                       clientId:
  *                                           type: string
  *                                       designId:
  *                                           type: string
  *                                       contractPrice:
  *                                           type: number
  *                                       status:
  *                                           type: string                                                                                                                                                 
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
  *          401:
  *               description: Unauthorized
  *               content:
  *                    application/json:
  *                        schema:
  *                            type: string
  *          403:
  *               description: Forbidden
  *               content:
  *                    application/json:
  *                        schema:
  *                            type: object
  *                            properties:
  *                                messageError:
  *                                    type: string 
  */
  router.get('/client/', verifyToken, isClient, contractService.getContractsByClientId)

  /**
     * @swagger
     * /api/contract/{id}:
     *  get:
     *    security:
     *      - bearerAuth: []
     *    tags:
     *      - Contracts
     *    summary: Get contract by Id
     *    description: This endpoint is for getting contract by Id
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
     *                  $ref: '#components/schemas/ContractData'
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
  router.get("/:id", verifyToken, isCurrentUserOrAdmin, contractService.getContractById);

  /**
  * @swagger
  * /api/contract:
  *  post:
  *      security:
  *           - bearerAuth: []
  *      tags:
  *           - Contracts
  *      summary: Create contract
  *      description: This endpoint is for creating contract
  *      requestBody:
  *           required: true
  *           content:
  *               application/json:
  *                   schema:
  *                       $ref: '#components/schemas/ContractData'
  *      responses:
  *          201:
  *              description: Created
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
  *                                       clientId:
  *                                           type: string
  *                                       designId:
  *                                           type: string
  *                                       contractPrice:
  *                                           type: number
  *                                       status:
  *                                           type: string
  *                                       id:
  *                                           type: string
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
  *                               data:
  *                                   type: object
  *                               messageError:
  *                                   type: string
  *          500:
  *               description: Server error
  *               content:
  *                   application/json:
  *                       schema:
  *                           type: object
  *                           properties:
  *                               status:
  *                                   type: number
  *                               messageError:
  *                                   type: string
  *          401:
  *               description: Unauthorized
  *               content:
  *                    application/json:
  *                        schema:
  *                            type: string
  *          403:
  *               description: Forbidden
  *               content:
  *                    application/json:
  *                        schema:
  *                            type: object
  *                            properties:
  *                                messageError:
  *                                    type: string 
  */
  router.post("/", verifyToken, isAdmin, contractService.createContract);

  /**
   * @swagger
   * /api/contract/{id}:
   *  put:
   *      security:
   *           - bearerAuth: []
   *      tags:
   *           - Contracts
   *      summary: Update contract by id
   *      description: |
   *          This endpoint is for updating contract status and create orderId field
   *          Case usage:
   *            - Client cancel contract before payment
   *            - Admin dùng route này để update contract status ở chỗ "Xác nhận đơn hàng":
   *              - Nếu mà Admin bấm Accept thì cập nhật contract status SUCCESS
   *              - Nếu mà Admin bấm Deny thì cập nhật contract status CANCEL và refund cho người dùng
   *      requestBody:
   *           required: true
   *           content:
   *               application/json:
   *                   schema:
   *                       type: object
   *                       properties:
   *                          status:
   *                            type: string
   *      parameters:
   *          - in: path
   *            name: id
   *            required: true
   *            description: Id required
   *            schema:
   *               type: string
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
   *                                       id:
   *                                           type: string
   *                                       clientId:
   *                                           type: string
   *                                       designId:
   *                                           type: string
   *                                       contractPrice:
   *                                           type: number
   *                                       contractFileURL:
   *                                           type: string 
   *                                       status:
   *                                           type: string
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
   *                               data:
   *                                   type: object
   *                               messageError:
   *                                   type: string
   *          500:
   *               description: Server error
   *               content:
   *                   application/json:
   *                       schema:
   *                           type: object
   *                           properties:
   *                               status:
   *                                   type: number
   *                               messageError:
   *                                   type: string
   *          401:
   *               description: Unauthorized
   *               content:
   *                    application/json:
   *                        schema:
   *                            type: string
   *          403:
   *               description: Forbidden
   *               content:
   *                    application/json:
   *                        schema:
   *                            type: object
   *                            properties:
   *                                messageError:
   *                                    type: string 
   */
  router.put("/:id", verifyToken, contractService.updateContract);
  router.put("/", verifyToken, contractService.updateContract);

  // router.delete("/:id", verifyToken, isAdmin, contractService.deleteContract); //Unused
  // router.delete("/", verifyToken, isAdmin, contractService.deleteContract); //Unused

  return app.use("/api/contract", router);
};

export { ContractRouter };
