import express from 'express';
import { colorController } from '../controller/ColorController';
import { isAdmin, verifyToken } from '../middleware/authen';

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
*          ColorData:
*              type: object
*              properties:
*                  id:
*                      type: string
*                  name:
*                      type: string
*                  description:
*                      type: string
*/

const ColorRouter = (app) => {
    const router = express.Router();

    /**
     * @swagger
     * /api/color/page/{page}:
     *  get:
     *      tags:
     *          - Colors
     *      summary: Get color by page
     *      description: This endpoint is for getting color by page
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
     *                                       $ref: '#components/schemas/ColorData'
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
    router.get('/page', colorController.getColorData);
    router.get('/page/:page', colorController.getColorData);

    /**
     * @swagger
     * /api/color/{id}:
     *  get:
     *      tags:
     *          - Colors
     *      summary: Get color by Id
     *      description: This endpoint is for getting color by Id
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
     *                                  $ref: '#components/schemas/ColorData'
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
    router.get('/:id', colorController.getColorById);
    
    //TODO: swagger here
    router.get('/', colorController.getAllColor);

    /**
    * @swagger
    * /api/color:
    *  post:
    *      security:
    *           - bearerAuth: []
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
    router.post('/', verifyToken, isAdmin, colorController.postColorController);


    /**
    * @swagger
    * /api/color/{id}:
    *  put:
    *      security:
    *           - bearerAuth: []
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
    router.put('/', verifyToken, isAdmin, colorController.putColorController);
    router.put('/:id', verifyToken, isAdmin, colorController.putColorController);

    /**
    * @swagger
    * /api/color/{id}:
    *  delete:
    *      security:
    *           - bearerAuth: []
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
    router.delete('/:id', verifyToken, isAdmin, colorController.deleteColorController);
    router.delete('/', verifyToken, isAdmin, colorController.deleteColorController);

    return app.use('/api/color', router);
}

export {
    ColorRouter
}
