import express from 'express';
import { returnPolicyController } from '../controller/ReturnPolicyController';

const router = express.Router();
/**
 * @swagger
 *  components:
 *      schemas:    
 *          ReturnPolicy:
 *              type: object
 *              properties:
 *                  id:
 *                      type: string
 *                  headerName:
 *                      type: string
 *                  headerDescription:
 *                      type: string
 *                  titleName:
 *                      type: string
 *                  titleDescription:
 *                      type: string
 *                  returnExchangeCases:
 *                      type: string
 *                  nonReturnExchangeCases:
 *                      type: string
 *                  returnProcedure:
 *                      type: string
 */


const ReturnPolicyRouter = (app) => {
    router.get('/:id', returnPolicyController.getReturnPolicyById);

    /**
    * @swagger
    * /api/return-policy/{id}:
    *  get:
    *      tags:
    *           - ReturnPolicy
    *      summary: Get return policy by id
    *      description: This endpoint is for getting return policy by id
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
    *                                       headerName:
    *                                           type: string
    *                                       headerDescription:
    *                                           type: string                                         
    *                                       titleName:
    *                                           type: string                                         
    *                                       titleDescription:
    *                                           type: string
    *                                       returnExchangeCases:
    *                                           type: string
    *                                       nonReturnExchangeCases:
    *                                           type: string
    *                                       returnProcedure:
    *                                           type: string
    *                               message:
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
    */

    router.post('/', returnPolicyController.postReturnPolicyController);
/**
 * @swagger
 * /api/return-policy:
 *  post:
 *      tags:
 *           - ReturnPolicy
 *      summary: Create return policy
 *      description: This endpoint is for creating return policy
 *      requestBody:
 *           required: true
 *           content:
 *               application/json:
 *                   schema:
 *                       $ref: '#components/schemas/ReturnPolicy' 
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
 *                                       headerName:
 *                                           type: string
 *                                       headerDescription:
 *                                           type: string
 *                                       titleName:
 *                                           type: string
 *                                       titleDescription:
 *                                           type: string
 *                                       returnExchangeCases:
 *                                           type: string
 *                                       nonReturnExchangeCases:
 *                                           type: string
 *                                       returnProcedure:
 *                                           type: string
 *                                       id:
 *                                           type: string
 *                               message:
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
    router.put('/', returnPolicyController.putReturnPolicyController);
    router.put('/:id', returnPolicyController.putReturnPolicyController);

    /**
    * @swagger
    * /api/return-policy/{id}:
    *  put:
    *      tags:
    *           - ReturnPolicy
    *      summary: Update color by id
    *      description: This endpoint is for updating return policy
    *      requestBody:
    *           required: true
    *           content:
    *               application/json:
    *                   schema:
    *                       $ref: '#components/schemas/ReturnPolicy'
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
    *                                       headerName:
    *                                           type: string
    *                                       headerDescription:
    *                                           type: string                                         
    *                                       titleName:
    *                                           type: string                                         
    *                                       titleDescription:
    *                                           type: string
    *                                       returnExchangeCases:
    *                                           type: string
    *                                       nonReturnExchangeCases:
    *                                           type: string
    *                                       returnProcedure:
    *                                           type: string
    *                               message:
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
    */
    router.delete('/:id', returnPolicyController.deleteReturnPolicyController);
    router.delete('/', returnPolicyController.deleteReturnPolicyController);

    /**
    * @swagger
    * /api/return-policy/{id}:
    *  delete:
    *      tags:
    *           - ReturnPolicy
    *      summary: Delete return policy by Id
    *      description: This endpoint is for deleting return policy
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

    return app.use('/api/return-policy', router);
}

export {
    ReturnPolicyRouter
}
