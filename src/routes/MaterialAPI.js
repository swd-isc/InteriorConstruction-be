import express from 'express';
import { materialController } from '../controller/MaterialController';
import { isAdmin, verifyToken } from '../middleware/authen';

const router = express.Router();

/**
 * @swagger
 *  components:
 *      schemas:
 *          Material:
 *              type: object
 *              properties:
 *                  name:
 *                      type: string
 *                  description:
 *                      type: string
 *          MaterialData:
 *              type: object
 *              properties:
 *                  id:
 *                      type: string
 *                  name:
 *                      type: string
 *                  description:
 *                      type: string
 */

const MaterialRouter = (app) => {

    /**
     * @swagger
     * /api/material/page/{page}:
     *  get:
     *      tags:
     *          - Materials
     *      summary: Get material by page
     *      description: This endpoint is for getting material by page
     *      parameters:
     *          - in: path
     *            name: page
     *            required: false
     *            description: For pagination
     *            schema:
     *               type: number
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
     *                                   type: array
     *                                   items:
     *                                       $ref: '#components/schemas/MaterialData'
     *                               page:
     *                                   type: number
     *                               totalPages:
     *                                   type: number
     *                               message:
     *                                   type: string
     *          500:
     *              description: Server error
     *              content:
     *                   application/json:
     *                       schema:
     *                           type: object
     *                           properties:
     *                               status:
     *                                   type: number
     *                               messageError:
     *                                   type: string
     */
    router.get('/page', materialController.getMaterialData);
    router.get('/page/:page', materialController.getMaterialData);


    /**
    * @swagger
    * /api/material:
    *  post:
    *      security:
    *           - bearerAuth: []
    *      tags:
    *           - Materials
    *      summary: Create material
    *      description: This endpoint is for creating material
    *      requestBody:
    *           required: true
    *           content:
    *               application/json:
    *                   schema:
    *                       $ref: '#components/schemas/Material'
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
    *                                       name:
    *                                           type: string
    *                                       description:
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
    *          401:
    *               description: Unauthorized
    *               content:
    *                    application/json:
    *                        schema:
    *                            type: string
    *          403:
    *               description: Forbidden
    *               content:
    *                    application/json:
    *                        schema:
    *                            type: object
    *                            properties:
    *                                messageError:
    *                                    type: string 
    */
    router.post('/', verifyToken, isAdmin, materialController.postMaterial);


    /**
    * @swagger
    * /api/material/{id}:
    *  put:
    *      security:
    *           - bearerAuth: []
    *      tags:
    *           - Materials
    *      summary: Update material by id
    *      description: This endpoint is for updating material
    *      requestBody:
    *           required: true
    *           content:
    *               application/json:
    *                   schema:
    *                       $ref: '#components/schemas/Material'
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
    *                                       name:
    *                                           type: string
    *                                       description:
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
    *          401:
    *               description: Unauthorized
    *               content:
    *                    application/json:
    *                        schema:
    *                            type: string
    *          403:
    *               description: Forbidden
    *               content:
    *                    application/json:
    *                        schema:
    *                            type: object
    *                            properties:
    *                                messageError:
    *                                    type: string 
    */
    router.put('/', verifyToken, isAdmin, materialController.putMaterialController);
    router.put('/:id', verifyToken, isAdmin, materialController.putMaterialController);


    /**
    * @swagger
    * /api/material/{id}:
    *  delete:
    *      security:
    *           - bearerAuth: []
    *      tags:
    *           - Materials
    *      summary: Delete material by Id
    *      description: This endpoint is for deleting material
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
    *          401:
    *               description: Unauthorized
    *               content:
    *                    application/json:
    *                        schema:
    *                            type: string
    *          403:
    *               description: Forbidden
    *               content:
    *                    application/json:
    *                        schema:
    *                            type: object
    *                            properties:
    *                                messageError:
    *                                    type: string 
    */
    router.delete('/:id', verifyToken, isAdmin, materialController.deleteMaterialController);
    router.delete('/', verifyToken, isAdmin, materialController.deleteMaterialController);

    /**
     * @swagger
     * /api/material/{id}:
     *  get:
     *      tags:
     *          - Materials
     *      summary: Get material by Id
     *      description: This endpoint is for getting material by Id
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
     *                          type: object
     *                          properties:
     *                              status:
     *                                  type: number
     *                              data:
     *                                  $ref: '#components/schemas/MaterialData'
     *                              message:
     *                                  type: string
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
    router.get("/:id", materialController.getMaterialById);
    router.get("/", materialController.getAllMaterial)

    return app.use('/api/material', router);
}

export {
    MaterialRouter
}
