import express from "express";
import { contractService } from "../controller/ContractController";

const router = express.Router();

/**
 * @swagger
 *  components:
 *      schemas:
 *          Contract:
 *              type: object
 *              properties:
 *                  clientId:
 *                      type: string
 *                  designId:
 *                      type: string
 *                  contractPrice:
 *                      type: number
 *                  status: 
 *                      type: string
 *          ContractData:
 *              type: object
 *              properties:
 *                  id:
 *                      type: string
 *                  clientId:
 *                      type: string
 *                  designId:
 *                      type: string
 *                  contractPrice:
 *                      type: number
 *                  status: 
 *                      type: string           
 */

const ContractRouter = (app) => {


/**
   * @swagger
   * /api/contract/{id}:
   *  get:
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
   */



    /**
    * @swagger
    * /api/contract:
    *  get:
    *      tags:
    *           - Contracts
    *      summary: Get contract by page
    *      description: This endpoint is for getting contract by page
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
    *                                       id:
    *                                           type: string                                          
    *                                       classificationName:
    *                                           type: string
    *                                           items:
    *                                               $ref: '#components/schemas/ContractData'                                                                  
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


  router.get("/", contractService.getContracts);
  router.get("/:id", contractService.getContractById);


    /**
    * @swagger
    * /api/contract:
    *  post:
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
    */

  router.post("/", contractService.createContract);

   /**
    * @swagger
    * /api/contract/{id}:
    *  put:
    *      tags:
    *           - Contracts
    *      summary: Update contract by id
    *      description: This endpoint is for updating contract
    *      requestBody:
    *           required: true
    *           content:
    *               application/json:
    *                   schema:
    *                       $ref: '#components/schemas/ContractData'
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
    */


  router.put("/:id", contractService.updateContract);
  router.put("/", contractService.updateContract);

/**
    * @swagger
    * /api/contract/{id}:
    *  delete:
    *      tags:
    *           - Contracts
    *      summary: Delete contract by Id
    *      description: This endpoint is for deleting contract
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
    *                                   $ref: '#components/schemas/MaterialData'
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
    */


  router.delete("/:id", contractService.deleteContract);
  router.delete("/", contractService.deleteContract);

  return app.use("/api/contract", router);
};

export { ContractRouter };
