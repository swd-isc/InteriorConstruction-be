import express from 'express';
import { materialController } from '../controller/MaterialController';

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
     */
    router.post('/', materialController.postMaterial);


    /**
    * @swagger
    * /api/material/{id}:
    *  put:
    *      tags:
    *           - Materials
    *      summary: Update material by id
    *      description: This endpoint is for updating material
    *      requestBody:
    *           required: true
    *           content:
    *               application/json:
    *                   schema:
    *                       $ref: '#components/schemas/Color'
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
    */
    router.put('/', materialController.putMaterialController);
    router.put('/:id', materialController.putMaterialController);


    /**
    * @swagger
    * /api/material/{id}:
    *  delete:
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
    */
    router.delete('/:id', materialController.deleteMaterialController);
    router.delete('/', materialController.deleteMaterialController);

    return app.use('/api/material', router);
}

export {
    MaterialRouter
}
