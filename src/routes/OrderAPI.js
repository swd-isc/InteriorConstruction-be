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
 *              orderId:
 *                type: string
 *              payDate:
 *                 type: string
 *              clientId:
 *                 type: string
 *              contractId:
 *                type: string
 *          OrderData:
 *            type: object
 *            properties:
 *              _id:
 *                type: string
 *              orderId:
 *                type: string
 *              payDate:
 *                 type: string
 *              clientId:
 *                 type: string
 *              contractId:
 *                type: string
 *                  
 */


const OrderRouter = (app) => {
/**
   * @swagger
   * /api/order:
   *  get:
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
  router.get("/", orderService.getOrders);

  /**
   * @swagger
   * /api/order/{id}:
   *  get:
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
  router.get("/:id", orderService.getOrderById);

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
  router.post("/", orderService.createOrder);

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
  router.put("/:id", orderService.updateOrder);

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
  router.delete("/:id", orderService.deleteOrder);

  return app.use("/api/order", router);
};

export { OrderRouter };
