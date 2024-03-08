import express from "express";
import { deliveryService } from "../controller/DeliveryController";
import { isAdmin, verifyToken } from "../middleware/authen";

const router = express.Router();

/**
 * @swagger
 *  components:
 *      schemas:
 *          Delivery:
 *            type: object
 *            properties:
 *              description:
 *                type: string
 *              noCharge:
 *                type: string
 *              surcharge:
 *                type: string
 *          DeliveryData:
 *            type: object
 *            properties:
 *              id:
 *                type: string
 *              description:
 *                type: string
 *              noCharge:
 *                type: string
 *              surcharge:
 *                type: string
 */

const DeliveryRouter = (app) => {
  /**
   * @swagger
   * /api/delivery:
   *  get:
   *    tags:
   *      - Deliveries
   *    summary: Get delivery by page
   *    description: This endpoint is for getting delivery by page
   *    parameters:
   *      - in: query
   *        name: page
   *        required: false
   *        description: For pagination
   *        schema:
   *          type: number
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
   *                  type: object
   *                  properties:
   *                    deliveries:
   *                      $ref: '#components/schemas/DeliveryData'
   *                    page:
   *                      type: number
   *                    totalPages:
   *                      type: number
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
   *                messageError:
   *                  type: string
   */
  router.get("/", deliveryService.getDeliveries);

  /**
   * @swagger
   * /api/delivery/{id}:
   *  get:
   *    tags:
   *      - Deliveries
   *    summary: Get delivery by Id
   *    description: This endpoint is for getting delivery by Id
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
   *                  $ref: '#components/schemas/DeliveryData'
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
  router.get("/:id", deliveryService.getDeliveryById);

  /**
   * @swagger
   * /api/delivery:
   *  post:
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Deliveries
   *    summary: Create delivery
   *    description: This endpoint is for creating delivery
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            $ref: '#components/schemas/Delivery'
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
   *                  $ref: '#components/schemas/DeliveryData'
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
  router.post("/", verifyToken, isAdmin, deliveryService.createDelivery);

  /**
   * @swagger
   * /api/delivery/{id}:
   *  put:
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Deliveries
   *    summary: Update delivery
   *    description: This endpoint is for updating delivery
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            $ref: '#components/schemas/Delivery'
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
   *                  $ref: '#components/schemas/DeliveryData'
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
  router.put("/:id", verifyToken, isAdmin, deliveryService.updateDelivery);
  router.put("/", verifyToken, isAdmin, deliveryService.updateDelivery);

  /**
   * @swagger
   * /api/delivery/{id}:
   *  delete:
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Deliveries
   *    summary: Delete delivery
   *    description: This endpoint is for deleting delivery
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
   *                  $ref: '#components/schemas/DeliveryData'
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
  router.delete("/:id", verifyToken, isAdmin, deliveryService.deleteDelivery);
  router.delete("/", verifyToken, isAdmin, deliveryService.deleteDelivery);

  return app.use("/api/delivery", router);
};

export { DeliveryRouter };
