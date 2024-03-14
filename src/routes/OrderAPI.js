import express from "express";
import { orderService } from "../controller/OrderController";
import { isAdmin, verifyToken } from "../middleware/authen";

const router = express.Router();

/**
 * @swagger
 *  components:
 *      schemas:
 *          Order:
 *            type: object
 *            properties:
 *              vnp_Amount:
 *                type: number
 *              vnp_BankCode:
 *                 type: string
 *              vnp_BankTranNo:
 *                 type: string
 *              vnp_CardType:
 *                type: string
 *              vnp_PayDate:
 *                type: string
 *              vnp_OrderInfo:
 *                type: string
 *              vnp_TransactionNo:
 *                type: string
 *              vnp_TransactionStatus:
 *                type: string
 *              vnp_TxnRef:
 *                type: string
 *              contractId:
 *                type: object
 *                properties:
 *                  client:
 *                    type: object
 *                    properties:
 *                      clientId:
 *                        type: string
 *                      firstName:
 *                        type: string
 *                      lastName:
 *                        type: string
 *                  _id:
 *                    type: string
 *                  designs:
 *                    type: array
 *                    items:
 *                      type: object
 *                      properties:
 *                        designId:
 *                          type: string
 *                        quantity:
 *                          type: number
 *                        designName:
 *                          type: string
 *                        furnitures:
 *                          type: array
 *                          items:
 *                            type: object
 *                            properties:
 *                              furnitureId:
 *                                type: string
 *                              name:
 *                                type: string
 *                  furnitures:
 *                    type: array
 *                    items:
 *                      type: object
 *                      properties:
 *                        furnitureId:
 *                          type: string
 *                        quantity:
 *                          type: number
 *                        name:
 *                          type: string
 *          OrderData:
 *            type: object
 *            properties:
 *              _id:
 *                type: string
 *              vnp_Amount:
 *                type: number
 *              vnp_BankCode:
 *                 type: string
 *              vnp_BankTranNo:
 *                 type: string
 *              vnp_CardType:
 *                type: string
 *              vnp_PayDate:
 *                type: string
 *              vnp_OrderInfo:
 *                type: string
 *              vnp_TransactionNo:
 *                type: string
 *              vnp_TransactionStatus:
 *                type: string
 *              vnp_TxnRef:
 *                type: string
 *              clientId:
 *                type: object
 *                properties:
 *                  id:
 *                    type: string
 *                  firstName:
 *                    type: string
 *                  lastName:
 *                    type: string
 *                  birthDate:
 *                    type: string
 *                  phone:
 *                    type: string
 *                  photoURL:
 *                    type: string
 *                  accountId:
 *                    type: object
 *                    properties:
 *                      id:
 *                        type: string
 *                      email:
 *                        type: string
 *                      role:
 *                        type: string
 *                      logInMethod:
 *                        type: string
 *                      status:
 *                        type: string
 *              contractId:
 *                $ref: '#components/schemas/ContractSchema'
 *          RefundData:
 *            type: object
 *            properties:
 *              _id:
 *                type: string
 *              vnp_TxnRef:
 *                type: string
 *              vnp_Amount:
 *                 type: number
 *              vnp_OrderInfo:
 *                 type: string
 *              vnp_BankCode:
 *                type: string
 *              vnp_PayDate:
 *                type: string
 *              vnp_TransactionNo:
 *                type: string
 *              vnp_TransactionType:
 *                type: string
 *              vnp_TransactionStatus:
 *                type: string
 *              clientId:
 *                type: object
 *                properties:
 *                  id:
 *                    type: string
 *                  firstName:
 *                    type: string
 *                  lastName:
 *                    type: string
 *                  birthDate:
 *                    type: string
 *                  phone:
 *                    type: string
 *                  photoURL:
 *                    type: string
 *                  accountId:
 *                    type: object
 *                    properties:
 *                      id:
 *                        type: string
 *                      email:
 *                        type: string
 *                      role:
 *                        type: string
 *                      logInMethod:
 *                        type: string
 *                      status:
 *                        type: string
 *              contractId:
 *                $ref: '#components/schemas/ContractSchema'
 */


const OrderRouter = (app) => {
  /**
     * @swagger
     * /api/order:
     *  get:
     *    security:
     *      - bearerAuth: []
     *    tags:
     *      - Orders
     *    summary: Get order
     *    description: This endpoint is for getting order
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
     *                  type: array
     *                  items:
     *                    $ref: '#components/schemas/OrderData'
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
     */
  router.get("/", verifyToken, orderService.getOrders);

  /**
   * @swagger
   * /api/order/{id}:
   *  get:
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Orders
   *    summary: Get order by Id
   *    description: This endpoint is for getting order by Id
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
   *                  $ref: '#components/schemas/OrderData'
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
  router.get("/:id", verifyToken, orderService.getOrderById);

  /**
   * @swagger
   * /api/order:
   *  post:
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Orders
   *    summary: Create order
   *    description: This endpoint is for creating order
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            $ref: '#components/schemas/Order'
   *    responses:
   *      201:
   *        description: Ok
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                status:
   *                  type: number
   *                data:
   *                  $ref: '#components/schemas/OrderData'
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
  router.post("/", verifyToken, orderService.createOrder);

  /**
   * @swagger
   * /api/order/{id}:
   *  put:
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Orders
   *    summary: Update order
   *    description: This endpoint is for updating order
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            $ref: '#components/schemas/Order'
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
   *                  $ref: '#components/schemas/OrderData'
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
  router.put("/:id", verifyToken, orderService.updateOrder);

  /**
   * @swagger
   * /api/order/{id}:
   *  delete:
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Orders
   *    summary: Delete order
   *    description: This endpoint is for deleting order
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
   *                  $ref: '#components/schemas/OrderData'
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
  router.delete("/:id", verifyToken, orderService.deleteOrder);

  return app.use("/api/order", router);
};

export { OrderRouter };
