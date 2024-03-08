import express from "express";
import { clientService } from "../controller/ClientController";
import { verifyToken } from "../middleware/authen";

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
 *                    designId:
 *                      type: object
 *                      properties:
 *                        id:
 *                          type: string
 *                        designName:
 *                          type: string
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
 *                    designId:
 *                      type: object
 *                      properties:
 *                        id:
 *                          type: string
 *                        designName:
 *                          type: string
 *                    contractPrice:
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
   *                          $ref: '#components/schemas/Client'
   *                        page:
   *                          type: number
   *                        totalPages:
   *                          type: number
   *                    message:
   *                      type: string
   *                    
   */
  router.get("/", clientService.getClients);

  /**
   * @swagger
   * /api/client/{id}:
   *  get:
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
   *                    
   */
  router.get("/:id", clientService.getClientById);

  router.post("/", clientService.createClient);

  router.put("/:id", verifyToken, clientService.updateClient);
  router.put("/", verifyToken, clientService.updateClient);

  router.delete("/:id", verifyToken, clientService.deleteClient);
  router.delete("/", verifyToken, clientService.deleteClient);

  return app.use("/api/client", router);
};

export { ClientRouter };
