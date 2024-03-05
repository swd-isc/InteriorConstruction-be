import express from 'express';
import { classificationController } from '../controller/ClassificationController';

const router = express.Router();

/**
 * @swagger
 *  components:
 *      schemas:
 *          Classification:
 *              type: object
 *              properties:
 *                  classificationName:
 *                      type: string
 *                  type:
 *                      type: string
 *          ClassificationData:
 *              type: object
 *              properties:
 *                  id:
 *                      type: string
 *                  classificationName:
 *                      type: string
 *                  type:
 *                      type: string 
 */


const ClassificationRouter = (app) => {

    /**
     * @swagger
     * /api/classification/page/{page}:
     *  get:
     *      tags:
     *          - Classifications
     *      summary: Get classification by page
     *      description: This endpoint is for getting classification by page
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
     *                                       $ref: '#components/schemas/ClassificationData'                             
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

    router.get('/page/:page', classificationController.getClassificationByPage);
    router.get('/', classificationController.getClassificationByType);


    router.post('/', classificationController.postClassificationController);


    router.put('/', classificationController.putClassificationController);
    router.put('/:id', classificationController.putClassificationController);


    router.delete('/:id', classificationController.deleteClassificationController);
    router.delete('/', classificationController.deleteClassificationController);

    return app.use('/api/classification', router);
}

export {
    ClassificationRouter
}
