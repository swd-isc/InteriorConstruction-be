import express from "express";
import { contractService } from "../controller/ContractController";
import { isAdmin, isCurrentUser, isCurrentUserOrAdmin, verifyToken } from "../middleware/authen";

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
 *              contractPrice:
 *                  type: number
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
  *      summary: Get contract by clientId
  *      description: This endpoint is for getting contract by clientId (if no clientId will find all contract for admin usage)
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
  *          - in: query
  *            name: clientId
  *            required: false
  *            description: For finding contract by clientId. default will find all contract by page
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
  router.get("/", verifyToken, contractService.getContracts);

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
   *      description: This endpoint is for updating contract
   *      requestBody:
   *           required: true
   *           content:
   *               application/json:
   *                   schema:
   *                       $ref: '#components/schemas/Contract'
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
  router.put("/:id", verifyToken, isAdmin, contractService.updateContract);
  router.put("/", verifyToken, isAdmin, contractService.updateContract);

  // router.delete("/:id", verifyToken, isAdmin, contractService.deleteContract); //Unused
  // router.delete("/", verifyToken, isAdmin, contractService.deleteContract); //Unused

  return app.use("/api/contract", router);
};

export { ContractRouter };
