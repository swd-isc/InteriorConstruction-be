import express from "express";
import { deliveryService } from "../controller/DeliveryController";

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

  router.post("/", deliveryService.createDelivery);

  router.put("/:id", deliveryService.updateDelivery);
  router.put("/", deliveryService.updateDelivery);

  router.delete("/:id", deliveryService.deleteDelivery);
  router.delete("/", deliveryService.deleteDelivery);

  return app.use("/api/delivery", router);
};

export { DeliveryRouter };
