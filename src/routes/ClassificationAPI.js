import express from 'express';
import { classificationController } from '../controller/ClassificationController';
import { isAdmin, verifyToken } from '../middleware/authen';

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

    /**
       * @swagger
       * /api/classification:
       *  get:
       *      tags:
       *           - Classifications
       *      summary: Get classification by type
       *      description: This endpoint is for getting classification by type
       *      parameters:
       *          - in: query
       *            name: type
       *            required: false
       *            description: For type
       *            schema:
       *               type: string
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
       *                                       id:
       *                                           type: string                                          
       *                                       classificationName:
       *                                           type: string
       *                                           items:
       *                                               $ref: '#components/schemas/ClassificationData'                                                                  
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

    router.get('/', classificationController.getClassificationByType);

    /**
    * @swagger
    * /api/classification:
    *  post:
    *      security:
    *           - bearerAuth: []
    *      tags:
    *           - Classifications
    *      summary: Create classification
    *      description: This endpoint is for creating classification
    *      requestBody:
    *           required: true
    *           content:
    *               application/json:
    *                   schema:
    *                       $ref: '#components/schemas/ClassificationData'
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
    *                                       classificationName:
    *                                           type: string
    *                                       type:
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


    router.post('/', verifyToken, isAdmin, classificationController.postClassificationController);

    /**
        * @swagger
        * /api/classification/{id}:
        *  put:
        *      security:
        *           - bearerAuth: []
        *      tags:
        *           - Classifications
        *      summary: Update classification by id
        *      description: This endpoint is for updating classification
        *      requestBody:
        *           required: true
        *           content:
        *               application/json:
        *                   schema:
        *                       $ref: '#components/schemas/ClassificationData'
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
        *                                       classificationName:
        *                                           type: string
        *                                       type:
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

    router.put('/', verifyToken, isAdmin, classificationController.putClassificationController);
    router.put('/:id', verifyToken, isAdmin, classificationController.putClassificationController);


    /**
    * @swagger
    * /api/classification/{id}:
    *  delete:
    *      security:
    *           - bearerAuth: []
    *      tags:
    *           - Classifications
    *      summary: Delete classification by Id
    *      description: This endpoint is for deleting classification
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
    *                                   $ref: '#components/schemas/ClassificationData'
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

    router.delete('/:id', verifyToken, isAdmin, classificationController.deleteClassificationController);
    router.delete('/', verifyToken, isAdmin, classificationController.deleteClassificationController);

    return app.use('/api/classification', router);
}

export {
    ClassificationRouter
}
