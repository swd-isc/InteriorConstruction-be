import express from "express";
import { designService } from "../controller/DesignController";
import { isAdmin, verifyToken } from "../middleware/authen";

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
 *              designCard:
 *                type: string
 *              designPrice:
 *                type: number
 *              type:
 *                type: string
 *              classifications:
 *                type: array
 *                items:
 *                  type: string
 *              furnitures:
 *                type: array
 *                items:
 *                  type: string
 *          DesignData:
 *            type: object
 *            properties:
 *              designName:
 *                type: string
 *              description:
 *                type: string
 *              designURL:
 *                type: string
 *              designCard:
 *                type: string
 *              designPrice:
 *                type: number
 *              type:
 *                type: string
 *              classifications:
 *                type: array
 *                items:
 *                  type: string
 *              furnitures:
 *                type: array
 *                items:
 *                  type: string
 *              id:
 *                type: string
 *          DesignDataCustom:
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
  /**
   * @swagger
   * /api/design:
   *  get:
   *    tags:
   *      - Designs
   *    summary: Get design by classificationId
   *    description: This endpoint is for getting design by classificationId
   *    parameters:
   *      - in: query
   *        name: page
   *        required: false
   *        description: For pagination
   *        schema:
   *          type: number
   *      - in: query
   *        name: sort_by
   *        required: false
   *        description: For sorting
   *        schema:
   *          type: string
   *      - in: query
   *        name: classificationId
   *        required: false
   *        description: For filter
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
   *                  type: object
   *                  properties:
   *                    designs:
   *                      type: array
   *                      items:
   *                        type: object
   *                        properties:
   *                           id:
   *                            type: string
   *                           designName:
   *                            type: string
   *                           description:
   *                            type: string
   *                           designURL:
   *                            type: string
   *                           classifications:
   *                            type: array
   *                            items:
   *                              type: string
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
  router.get("/", designService.getDesigns); //This router just for type = "DEFAULT"

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
   *                  $ref: '#components/schemas/DesignDataCustom'
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

  /**
   * @swagger
   * /api/design:
   *  post:
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Designs
   *    summary: Create design
   *    description: This endpoint is for creating design
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              designName:
   *                type: string
   *              description:
   *                type: string
   *              designURL:
   *                type: string
   *              designCard:
   *                type: string
   *              designPrice:
   *                type: number
   *              classifications:
   *                type: array
   *                items:
   *                  type: string
   *              furnitures:
   *                type: array
   *                items:
   *                  type: string
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
  router.post("/", verifyToken, isAdmin, designService.createDesign);

  /**
   * @swagger
   * /api/design/{id}:
   *  put:
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Designs
   *    summary: Update design
   *    description: This endpoint is for updating design
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            $ref: '#components/schemas/Design'
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
  router.put("/:id", verifyToken, isAdmin, designService.updateDesign);
  router.put("/", verifyToken, isAdmin, designService.updateDesign);

  /**
   * @swagger
   * /api/design/{id}:
   *  delete:
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Designs
   *    summary: Delete design
   *    description: This endpoint is for deleting design
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
  router.delete("/:id", verifyToken, isAdmin, designService.deleteDesign);
  router.delete("/", verifyToken, isAdmin, designService.deleteDesign);

  return app.use("/api/design", router);
};

export { DesignRouter };
