import express from 'express';
import { colorController } from '../controller/ColorController';

/**
 * @swagger
 *  components:
 *      schemas:
 *          Color:
 *              type: object
 *              properties:
 *                  name:
 *                      type: string
 *                  description:
 *                      type: string
 */

const ColorRouter = (app) => {
    const router = express.Router();

    router.get('/page', colorController.getColorData);
    router.get('/page/:page', colorController.getColorData);
    router.get('/:id', colorController.getColorById);
    router.get('/', colorController.getColorById);

    /**
    * @swagger
    * /api/color:
    *  post:
    *      summary: Create color
    *      description: This endpoint is for creating color
    *      requestBody:
    *           required: true
    *           content:
    *               application/json:
    *                   schema:
    *                       $ref: '#components/schemas/Color'
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
    *                                       name:
    *                                           type: string
    *                                       description:
    *                                           type: string
    *                                       id:
    *                                           type: string
    *                               message:
    *                                   type: string
    *          400:
    *              description: Server error
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
    */
    router.post('/', colorController.postColorController);


    router.put('/', colorController.putColorController);
    router.put('/:id', colorController.putColorController);


    router.delete('/:id', colorController.deleteColorController);
    router.delete('/', colorController.deleteColorController);

    return app.use('/api/color', router);
}

export {
    ColorRouter
}
