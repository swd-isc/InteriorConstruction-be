import express from "express";
import { designCardService } from "../controller/DesignCardController";
import { isAdmin, verifyToken } from "../middleware/authen";

const router = express.Router();

/**
 * @swagger
 *  components:
 *      schemas:
 *          DesignCard:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *              description:
 *                type: string
 *              imgURL:
 *                type: string
 *          DesignCardData:
 *            type: object
 *            properties:
 *              id:
 *                type: string
 *              title:
 *                type: string
 *              description:
 *                type: string
 *              imgURL:
 *                type: string
 */

const DesignCardRouter = (app) => {
  /**
  * @swagger
  * /api/design-card:
  *  get:
  *      tags:
  *           - DesignCard
  *      summary: Get design card by page
  *      description: This endpoint is for getting design card by page
  *      parameters:
  *          - in: query
  *            name: page
  *            required: false
  *            description: For pagination
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
  *                                       designCards:
  *                                          $ref: '#components/schemas/DesignCardData'                                         
  *                                       page:
  *                                           type: number
  *                                       totalPages:
  *                                           type: number                                                                                                      
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
  router.get("/", designCardService.getDesignCards);

  /**
     * @swagger
     * /api/design-card/{id}:
     *  get:
     *    tags:
     *      - DesignCard
     *    summary: Get design card by Id
     *    description: This endpoint is for getting design card by Id
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
     *                  $ref: '#components/schemas/DesignCardData'
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
  router.get("/:id", designCardService.getDesignCardById);

  /**
     * @swagger
     * /api/design-card:
     *  post:
     *    security:
     *      - bearerAuth: []
     *    tags:
     *      - DesignCard
     *    summary: Create design card
     *    description: This endpoint is for creating design card
     *    requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            $ref: '#components/schemas/DesignCard'
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
     *                  $ref: '#components/schemas/DesignCardData'
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
  router.post("/", verifyToken, isAdmin, designCardService.createDesignCard);

  /**
     * @swagger
     * /api/design-card/{id}:
     *  put:
     *    security:
     *      - bearerAuth: []
     *    tags:
     *      - DesignCard
     *    summary: Update design card
     *    description: This endpoint is for updating design card
     *    requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            $ref: '#components/schemas/DesignCard'
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
     *                  $ref: '#components/schemas/DesignCardData'
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
  router.put("/:id", verifyToken, isAdmin, designCardService.updateDesignCard);
  router.put("/", verifyToken, isAdmin, designCardService.updateDesignCard);


  /**
     * @swagger
     * /api/design-card/{id}:
     *  delete:
     *    security:
     *      - bearerAuth: []
     *    tags:
     *      - DesignCard
     *    summary: Delete design card
     *    description: This endpoint is for deleting design card
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
     *                  $ref: '#components/schemas/DesignCardData'
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
  router.delete("/:id", verifyToken, isAdmin, designCardService.deleteDesignCard);
  router.delete("/", verifyToken, isAdmin, designCardService.deleteDesignCard);

  return app.use("/api/design-card", router);
};

export { DesignCardRouter };
