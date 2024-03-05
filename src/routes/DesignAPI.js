import express from "express";
import { designService } from "../controller/DesignController";

const router = express.Router();

/**
 * @swagger
 *  components:
 *      schemas:
 *          Design:
 *            type: object
 *            properties:
 *              designName:
 *                type: string
 *              description:
 *                type: string
 *              designURL:
 *                type: string
 *              designPrice:
 *                type: number
 *              designCard:
 *                $ref: '#components/schemas/DesignCardData'
 *              furnitures:
 *                type: array
 *                items:
 *                  $ref: '#components/schemas/FurnitureData'
 *          DesignData:
 *            type: object
 *            properties:
 *              id:
 *                type: string
 *              designName:
 *                type: string
 *              description:
 *                type: string
 *              designURL:
 *                type: string
 *              designPrice:
 *                type: number
 *              designCard:
 *                $ref: '#components/schemas/DesignCardData'
 *              furnitures:
 *                type: array
 *                items:
 *                  $ref: '#components/schemas/FurnitureData'
 */

const DesignRouter = (app) => {

  router.get("/", designService.getDesigns);

  /**
   * @swagger
   * /api/design/{id}:
   *  get:
   *    tags:
   *      - Designs
   *    summary: Get design by Id
   *    description: This endpoint is for getting design by Id
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
   *                  $ref: '#components/schemas/DesignData'
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
  router.get("/:id", designService.getDesignById);

  router.post("/", designService.createDesign);

  router.put("/:id", designService.updateDesign);
  router.put("/", designService.updateDesign);

  router.delete("/:id", designService.deleteDesign);
  router.delete("/", designService.deleteDesign);

  return app.use("/api/design", router);
};

export { DesignRouter };
