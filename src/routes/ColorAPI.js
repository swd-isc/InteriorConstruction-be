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
    *      tags:
    *           - Colors
    *      summary: Create color
    *      description: This endpoint is for creating color
    *      requestBody:
    *           required: true
    *           content:
    *               application/json:
    *                   schema:
    *                       $ref: '#components/schemas/Color'
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
    router.post('/', colorController.postColorController);


    /**
    * @swagger
    * /api/color/{id}:
    *  put:
    *      tags:
    *           - Colors
    *      summary: Update color by id
    *      description: This endpoint is for updating color
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
    router.put('/', colorController.putColorController);
    router.put('/:id', colorController.putColorController);

    /**
    * @swagger
    * /api/color/{id}:
    *  delete:
    *      tags:
    *           - Colors
    *      summary: Delete color by Id
    *      description: This endpoint is for deleting color
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
    router.delete('/:id', colorController.deleteColorController);
    router.delete('/', colorController.deleteColorController);

    return app.use('/api/color', router);
}

export {
    ColorRouter
}
