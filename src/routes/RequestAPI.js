import express from "express";
import { requestService } from "../controller/RequestController";
import { isAdmin, isClient, verifyToken } from "../middleware/authen";

const router = express.Router();
/**
* @swagger
*  components:
*      schemas:
*          Request:
*              type: object
*              properties:
*                  status:
*                      type: string
*          CreateRequest:
*              type: object
*              properties:
*                  clientId:
*                      type: string
*                  contractId:
*                      type: string
*                  refundAmount:
*                      type: number
*          RequestData:
*              type: object
*              properties:
*                  id:
*                      type: string
*                  refundAmount:
*                      type: number
*                  clientId:
*                      type: object
*                      properties:
*                         id:
*                           type: string
*                         firstName:
*                           type: string
*                         lastName:
*                           type: string
*                  contractId:
*                      type: string
*                  date:
*                      type: string
*                  status:
*                      type: string
*/

const RequestRouter = (app) => {

   /**
      * @swagger
      * /api/request/:
      *  get:
      *      security:
      *          - bearerAuth: []
      *      tags:
      *          - Request Refund
      *      summary: Get all client requests by Admin
      *      description: This endpoint is for Admin getting all client requests
      *      responses:
      *          200:
      *              description: OK
      *              content:
      *                  application/json:
      *                      schema:
      *                          $ref: '#components/schemas/RequestData'
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
   router.get("/", verifyToken, isAdmin, requestService.getRequests);

   /**
      * @swagger
      * /api/request/{id}:
      *  get:
      *      security:
      *          - bearerAuth: []
      *      tags:
      *          - Request Refund
      *      summary: Admin get client request by Id
      *      description: This endpoint is for Admin getting client request by Id
      *      parameters:
      *          - in: path
      *            name: id
      *            description: Id required
      *            required: true
      *            schema:
      *                  type: string
      *      responses:
      *          200:
      *              description: OK
      *              content:
      *                  application/json:
      *                      schema:
      *                          $ref: '#components/schemas/RequestData'
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
   router.get("/:id", verifyToken, isAdmin, requestService.getRequestById);

   /**
      * @swagger
      * /api/request/client/{id}:
      *  get:
      *      security:
      *          - bearerAuth: []
      *      tags:
      *          - Request Refund
      *      summary: Client get client request by Id
      *      description: This endpoint is for Client getting client request by Id
      *      parameters:
      *          - in: path
      *            name: id
      *            description: Id required
      *            required: true
      *            schema:
      *                  type: string
      *      responses:
      *          200:
      *              description: OK
      *              content:
      *                  application/json:
      *                      schema:
      *                          $ref: '#components/schemas/RequestData'
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
   router.get("/client/:id", verifyToken, isClient, requestService.getRequestsByClientId);

   /**
      * @swagger
      * /api/request/:
      *  post:
      *      security:
      *          - bearerAuth: []
      *      tags:
      *          - Request Refund
      *      summary: Client request refund
      *      description: This endpoint is for Client request refund
      *      requestBody:
      *           required: true
      *           content:
      *               application/json:
      *                   schema:
      *                       $ref: '#components/schemas/CreateRequest'
      *      responses:
      *          201:
      *              description: OK
      *              content:
      *                  application/json:
      *                      schema:
      *                          $ref: '#components/schemas/RequestData'
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
   router.post("/", verifyToken, requestService.createRequest);

   /**
      * @swagger
      * /api/request/{id}:
      *  put:
      *      security:
      *          - bearerAuth: []
      *      tags:
      *          - Request Refund
      *      summary: Admin update status request
      *      description: This endpoint is for Admin updating status request
      *      parameters:
      *          - in: path
      *            name: id
      *            description: Id required
      *            required: true
      *            schema:
      *                  type: string
      *      requestBody:
      *           required: true
      *           content:
      *               application/json:
      *                   schema:
      *                       $ref: '#components/schemas/Request'
      *      responses:
      *          201:
      *              description: OK
      *              content:
      *                  application/json:
      *                      schema:
      *                          $ref: '#components/schemas/RequestData'
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
   router.put("/:id", verifyToken, isAdmin, requestService.updateRequest);

   router.delete("/:id", verifyToken, isAdmin, requestService.deleteRequest);

   return app.use("/api/request", router);
};

export { RequestRouter };
