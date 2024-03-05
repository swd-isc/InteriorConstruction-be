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
     *                                       $ref: '#components/schemas/Material'
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


    router.post('/', materialController.postMaterial);



    router.put('/', materialController.putMaterialController);
    router.put('/:id', materialController.putMaterialController);



    router.delete('/:id', materialController.deleteMaterialController);
    router.delete('/', materialController.deleteMaterialController);

    return app.use('/api/material', router);
}

export {
    MaterialRouter
}
