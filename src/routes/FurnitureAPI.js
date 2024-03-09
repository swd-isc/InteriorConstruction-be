import express from 'express';
import { furnitureController } from '../controller/FurnitureController';
import { isAdmin, verifyToken } from '../middleware/authen';

/**
 * @swagger
 *  components:
 *      schemas:
 *          Furniture:
 *              type: object
 *              properties:
 *                  name:
 *                      type: string
 *                  imgURL:
 *                      type: array
 *                      items:
 *                          type: string
 *                  description:
 *                      type: string
 *                  colors:
 *                      type: array
 *                      items:
 *                          type: string
 *                  materials:
 *                      type: array
 *                      items:
 *                          type: string
 *                  sizes:
 *                      type: string
 *                  price:
 *                      type: number
 *                  returnExchangeCases:
 *                      type: array
 *                      items:
 *                          type: string
 *                  nonReturnExchangeCases:
 *                      type: array
 *                      items:
 *                          type: string
 *                  delivery:
 *                      type: string
 *                  type:
 *                      type: string
 *                      enum:
 *                          - default
 *                          - custom
 *                  customBy:
 *                      type: string
 *                  classifications:
 *                      type: array
 *                      items:
 *                          type: string
 *          FurnitureData:
 *              type: object
 *              properties:
 *                  id:
 *                      type: string
 *                  name:
 *                      type: string
 *                  imgURL:
 *                      type: array
 *                      items:
 *                          type: string
 *                  price:
 *                      type: number
 *          FurnitureDelete:
 *              type: object
 *              properties:
 *                  name:
 *                      type: string
 *                  imgURL:
 *                      type: array
 *                      items:
 *                          type: string
 *                  description:
 *                      type: string
 *                  colors:
 *                      type: array
 *                      items:
 *                          type: object
 *                          properties:
 *                              name:
 *                                  type: string
 *                  materials:
 *                      type: array
 *                      items:
 *                          type: object
 *                          properties:
 *                              name:
 *                                  type: string
 *                  sizes:
 *                      type: string
 *                  price:
 *                      type: number
 *                  returnExchangeCases:
 *                      type: array
 *                      items:
 *                          type: string
 *                  nonReturnExchangeCases:
 *                      type: array
 *                      items:
 *                          type: string
 *                  delivery:
 *                      $ref: '#components/schemas/Delivery'
 *                  type:
 *                      type: string
 *                      enum:
 *                          - default
 *                          - custom
 *                  customBy:
 *                      type: string
 *                  classifications:
 *                      type: array
 *                      items:
 *                          type: object
 *                          properties:
 *                              classificationName:
 *                                  type: string
 */

const FurnitureRouter = (app) => {
    const router = express.Router();

    router.get('/price/', furnitureController.userFurnitureByPage);
    router.get('/price/:page/:asc', furnitureController.userFurnitureByPage);
    router.get('/price/:asc', furnitureController.userFurnitureByPage);
    router.get('/type/', furnitureController.furnitureByType);
    router.get('/type/:type', furnitureController.furnitureByType);
    router.get('/classification/type/', furnitureController.furnitureByClassificationByType);
    router.get('/classification/type/:type', furnitureController.furnitureByClassificationByType);
    router.get('/classification/name/', furnitureController.furnitureByClassificationByName);
    router.get('/classification/name/:name', furnitureController.furnitureByClassificationByName);
    router.get('/material/', furnitureController.furnitureByMaterial);
    router.get('/material/:materialName', furnitureController.furnitureByMaterial);
    router.get('/color/', furnitureController.furnitureByColor);
    router.get('/color/:colorName', furnitureController.furnitureByColor);

    /**
    * @swagger
    * /api/furniture/ad:
    *  get:
    *      security:
    *          - bearerAuth: []
    *      tags:
    *           - Furnitures
    *      summary: Admin get furniture by page
    *      description: This endpoint is for admin getting furniture by page
    *      parameters:
    *          - in: query
    *            name: page
    *            required: false
    *            description: For pagination, default = 1
    *            schema:
    *               type: string
    *          - in: query
    *            name: sort_by
    *            required: false
    *            description: For sorting furniture by price, default = ASC
    *            schema:
    *               type: string
    *               enum:
    *                   - ASC
    *                   - DESC
    *          - in: query
    *            name: type
    *            required: false
    *            description: For filter furniture by type, default <=> find all
    *            schema:
    *               type: string
    *               enum:
    *                   - DEFAULT
    *                   - CUSTOM
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
    *                                       imgURL:
    *                                           type: array
    *                                           items:
    *                                               type: string
    *                                       materials:
    *                                           type: array
    *                                           items:
    *                                               type: object
    *                                               properties:
    *                                                   name:
    *                                                       type: string
    *                                       colors:
    *                                           type: array
    *                                           items:
    *                                               type: object
    *                                               properties:
    *                                                   name:
    *                                                       type: string
    *                                       sizes:
    *                                           type: string
    *                                       price:
    *                                           type: number
    *                                       type:
    *                                           type: string
    *                                       classifications:
    *                                           type: array
    *                                           items:
    *                                               type: object
    *                                               properties:
    *                                                   classificationName:
    *                                                       type: string
    *                                       delivery:
    *                                           type: object
    *                                           properties:
    *                                               description:
    *                                                   type: string
    *                                               noCharge:
    *                                                   type: string
    *                                               surcharge:
    *                                                   type: string
    *                                       description:
    *                                           type: string
    *                                       nonReturnExchangeCases:
    *                                           type: array
    *                                           items:
    *                                               type: string
    *                                       returnExchangeCases:
    *                                           type: array
    *                                           items:
    *                                               type: string
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
    router.get('/ad', isAdmin, furnitureController.adminFurnitureByPage);

    /**
    * @swagger
    * /api/furniture/ad/{id}:
    *  get:
    *      security:
    *          - bearerAuth: []
    *      tags:
    *           - Furnitures
    *      summary: Admin get furniture by id
    *      description: This endpoint is for admin getting furniture by id
    *      parameters:
    *          - in: path
    *            name: id
    *            required: true
    *            description: Id required
    *            schema:
    *               type: string
    *          - in: query
    *            name: page
    *            required: false
    *            description: For pagination, default = 1
    *            schema:
    *               type: string
    *          - in: query
    *            name: sort_by
    *            required: false
    *            description: For sorting furniture by price, default = ASC
    *            schema:
    *               type: string
    *               enum:
    *                   - ASC
    *                   - DESC
    *          - in: query
    *            name: type
    *            required: false
    *            description: For filter furniture by type, default <=> find all
    *            schema:
    *               type: string
    *               enum:
    *                   - DEFAULT
    *                   - CUSTOM
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
    *                                       imgURL:
    *                                           type: array
    *                                           items:
    *                                               type: string
    *                                       materials:
    *                                           type: array
    *                                           items:
    *                                               type: object
    *                                               properties:
    *                                                   name:
    *                                                       type: string
    *                                       colors:
    *                                           type: array
    *                                           items:
    *                                               type: object
    *                                               properties:
    *                                                   name:
    *                                                       type: string
    *                                       sizes:
    *                                           type: string
    *                                       price:
    *                                           type: number
    *                                       type:
    *                                           type: string
    *                                       classifications:
    *                                           type: array
    *                                           items:
    *                                               type: object
    *                                               properties:
    *                                                   classificationName:
    *                                                       type: string
    *                                       delivery:
    *                                           type: object
    *                                           properties:
    *                                               description:
    *                                                   type: string
    *                                               noCharge:
    *                                                   type: string
    *                                               surcharge:
    *                                                   type: string
    *                                       description:
    *                                           type: string
    *                                       nonReturnExchangeCases:
    *                                           type: array
    *                                           items:
    *                                               type: string
    *                                       returnExchangeCases:
    *                                           type: array
    *                                           items:
    *                                               type: string
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
    router.get('/ad/:id', isAdmin, furnitureController.adminFurnitureById);

    /**
    * @swagger
    * /api/furniture:
    *  get:
    *      tags:
    *           - Furnitures
    *      summary: User get furniture by page
    *      description: This endpoint is for user getting furniture by page
    *      parameters:
    *          - in: query
    *            name: page
    *            required: false
    *            description: For pagination, default = 1
    *            schema:
    *               type: string
    *          - in: query
    *            name: sort_by
    *            required: false
    *            description: For sorting furniture by price, default = ASC
    *            schema:
    *               type: string
    *               enum:
    *                   - ASC
    *                   - DESC
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
    *                                       imgURL:
    *                                           type: array
    *                                           items:
    *                                               type: string
    *                                       materials:
    *                                           type: array
    *                                           items:
    *                                               type: object
    *                                               properties:
    *                                                   name:
    *                                                       type: string
    *                                       colors:
    *                                           type: array
    *                                           items:
    *                                               type: object
    *                                               properties:
    *                                                   name:
    *                                                       type: string
    *                                       sizes:
    *                                           type: string
    *                                       price:
    *                                           type: number
    *                                       type:
    *                                           type: string
    *                                       classifications:
    *                                           type: array
    *                                           items:
    *                                               type: object
    *                                               properties:
    *                                                   classificationName:
    *                                                       type: string
    *                                       delivery:
    *                                           type: object
    *                                           properties:
    *                                               description:
    *                                                   type: string
    *                                               noCharge:
    *                                                   type: string
    *                                               surcharge:
    *                                                   type: string
    *                                       description:
    *                                           type: string
    *                                       nonReturnExchangeCases:
    *                                           type: array
    *                                           items:
    *                                               type: string
    *                                       returnExchangeCases:
    *                                           type: array
    *                                           items:
    *                                               type: string
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
    router.get('/', furnitureController.userFurnitureByPage);

    /**
    * @swagger
    * /api/furniture/{id}:
    *  get:
    *      tags:
    *           - Furnitures
    *      summary: User get furniture by id
    *      description: This endpoint is for user getting furniture by id
    *      parameters:
    *          - in: path
    *            name: id
    *            required: true
    *            description: Id required
    *            schema:
    *               type: string
    *          - in: query
    *            name: page
    *            required: false
    *            description: For pagination, default = 1
    *            schema:
    *               type: string
    *          - in: query
    *            name: sort_by
    *            required: false
    *            description: For sorting furniture by price, default = ASC
    *            schema:
    *               type: string
    *               enum:
    *                   - ASC
    *                   - DESC
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
    *                                       imgURL:
    *                                           type: array
    *                                           items:
    *                                               type: string
    *                                       materials:
    *                                           type: array
    *                                           items:
    *                                               type: object
    *                                               properties:
    *                                                   name:
    *                                                       type: string
    *                                       colors:
    *                                           type: array
    *                                           items:
    *                                               type: object
    *                                               properties:
    *                                                   name:
    *                                                       type: string
    *                                       sizes:
    *                                           type: string
    *                                       price:
    *                                           type: number
    *                                       type:
    *                                           type: string
    *                                       classifications:
    *                                           type: array
    *                                           items:
    *                                               type: object
    *                                               properties:
    *                                                   classificationName:
    *                                                       type: string
    *                                       delivery:
    *                                           type: object
    *                                           properties:
    *                                               description:
    *                                                   type: string
    *                                               noCharge:
    *                                                   type: string
    *                                               surcharge:
    *                                                   type: string
    *                                       description:
    *                                           type: string
    *                                       nonReturnExchangeCases:
    *                                           type: array
    *                                           items:
    *                                               type: string
    *                                       returnExchangeCases:
    *                                           type: array
    *                                           items:
    *                                               type: string
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
    router.get('/:id', furnitureController.userFurnitureById);


    /**
     * @swagger
     * /api/furniture:
     *  post:
     *      security:
     *          - bearerAuth: []
     *      tags:
     *          - Furnitures
     *      summary: Create furniture
     *      description: This endpoint is for creating furniture
     *      requestBody:
     *           required: true
     *           content:
     *               application/json:
     *                   schema:
     *                       $ref: '#components/schemas/Furniture'
     *      responses:
     *          201:
     *              description: OK
     *              content:
     *                   application/json:
     *                       schema:
     *                          type: object
     *                          properties:
     *                              status:
     *                                  type: number
     *                              data:
     *                                  $ref: '#components/schemas/Furniture'
     *                              message:
     *                                  type: string
     *          400:
     *              description: Bad request
     *              content:
     *                   application/json:
     *                       schema:
     *                          type: object
     *                          properties:
     *                              status:
     *                                  type: number
     *                              data:
     *                                  type: object
     *                              messageError:
     *                                  type: string
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
    router.post('/', verifyToken, isAdmin, furnitureController.createFurController);

    /**
     * @swagger
     *  /api/furniture/{id}:
     *  put:
     *      security:
     *          - bearerAuth: []
     *      tags:
     *          - Furnitures
     *      summary: Update furniture by Id
     *      description: This endpoint is for updating furniture by Id
     *      requestBody:
     *           required: true
     *           content:
     *               application/json:
     *                   schema:
     *                       $ref: '#components/schemas/Furniture'
     *      parameters:
     *          - in: path
     *            name: id
     *            required: true
     *            description: Id required
     *            schema:
     *               type: string
     *      responses:
     *          200:
     *              description: Ok
     *              content:
     *                   application/json:
     *                       schema:
     *                          type: object
     *                          properties:
     *                              status:
     *                                  type: number
     *                              data:
     *                                  $ref: '#components/schemas/Furniture'
     *                              message:
     *                                  type: string
     *          400:
     *              description: Bad request
     *              content:
     *                   application/json:
     *                       schema:
     *                          type: object
     *                          properties:
     *                              status:
     *                                  type: number
     *                              data:
     *                                  type: object
     *                              messageError:
     *                                  type: string
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
    router.put('/', verifyToken, isAdmin, furnitureController.updateFurController);
    router.put('/:id', verifyToken, isAdmin, furnitureController.updateFurController);

    /**
     * @swagger
     * /api/furniture/{id}:
     *  delete:
     *      security:
     *          - bearerAuth: []
     *      tags:
     *          - Furnitures
     *      summary: Delete furniture by Id
     *      description: This endpoint is for deleting furniture by Id
     *      parameters:
     *          - in: path
     *            name: id
     *            required: true
     *            description: Id required
     *            schema:
     *               type: string
     *      responses:
     *          200:
     *              description: Ok
     *              content:
     *                   application/json:
     *                       schema:
     *                          type: object
     *                          properties:
     *                              status:
     *                                  type: number
     *                              data:
     *                                  $ref: '#components/schemas/FurnitureDelete'
     *                              message:
     *                                  type: string
     *          400:
     *              description: Bad request
     *              content:
     *                   application/json:
     *                       schema:
     *                          type: object
     *                          properties:
     *                              status:
     *                                  type: number
     *                              data:
     *                                  type: object
     *                              messageError:
     *                                  type: string
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
    router.delete('/:id', verifyToken, isAdmin, furnitureController.deleteFurController);
    router.delete('/', verifyToken, isAdmin, furnitureController.deleteFurController);

    return app.use('/api/furniture', router);
}

const ShopRouter = (app) => {
    const router = express.Router();
    /**
    * @swagger
    * /api/shop/filter-session:
    *  get:
    *      tags:
    *           - Furnitures
    *      summary: Get furniture by filter
    *      description: This endpoint is for getting furniture by filter
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
    *            description: Just sort furniture array by price
    *            schema:
    *               type: string
    *               enum:
    *                   - asc
    *                   - desc
    *          - in: query
    *            name: classificationId
    *            required: false
    *            description: Filter by classificationId
    *            schema:
    *               type: string
    *          - in: query
    *            name: colorId
    *            required: false
    *            description: Filter by colorId
    *            schema:
    *               type: string
    *          - in: query
    *            name: materialId
    *            required: false
    *            description: Filter by materialId
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
    *                                       colors:
    *                                           type: array
    *                                           items:
    *                                               type: object
    *                                               properties:
    *                                                   id:
    *                                                       type: string
    *                                                   name:
    *                                                       type: string
    *                                                   count:
    *                                                       type: number
    *                                       materials:
    *                                           type: array
    *                                           items:
    *                                               type: object
    *                                               properties:
    *                                                   id:
    *                                                       type: string
    *                                                   name:
    *                                                       type: string
    *                                                   count:
    *                                                       type: number
    *                                       furnitures:
    *                                           type: array
    *                                           items:
    *                                               $ref: '#components/schemas/FurnitureData'
    *                                       page:
    *                                           type: string
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
    */
    router.get('/filter-session', furnitureController.filterSession);

    /**
    * @swagger
    * /api/shop/search:
    *  get:
    *      tags:
    *           - Furnitures
    *      summary: Search furniture by name
    *      description: This endpoint is for searching furniture by name
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
    *            description: Just sort furniture array by price
    *            schema:
    *               type: string
    *               enum:
    *                   - asc
    *                   - desc
    *          - in: query
    *            name: furName
    *            required: false
    *            description: Find by furniture name, default find all.
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
    *                                       colors:
    *                                           type: array
    *                                           items:
    *                                               type: object
    *                                               properties:
    *                                                   id:
    *                                                       type: string
    *                                                   name:
    *                                                       type: string
    *                                                   count:
    *                                                       type: number
    *                                       materials:
    *                                           type: array
    *                                           items:
    *                                               type: object
    *                                               properties:
    *                                                   id:
    *                                                       type: string
    *                                                   name:
    *                                                       type: string
    *                                                   count:
    *                                                       type: number
    *                                       furnitures:
    *                                           type: array
    *                                           items:
    *                                               $ref: '#components/schemas/FurnitureData'
    *                                       page:
    *                                           type: string
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
    */
    router.get('/search', furnitureController.searchFurController);

    /**
    * @swagger
    * /api/shop:
    *  get:
    *      tags:
    *           - Furnitures
    *      summary: Get furniture by page
    *      description: This endpoint is for getting furniture by page
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
    *            description: Just sort furniture array by price
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
    *                                       colors:
    *                                           type: array
    *                                           items:
    *                                               $ref: '#components/schemas/ColorData'
    *                                       materials:
    *                                           type: array
    *                                           items:
    *                                               $ref: '#components/schemas/MaterialData'
    *                                       furnitures:
    *                                           type: array
    *                                           items:
    *                                               $ref: '#components/schemas/FurnitureData'
    *                                       page:
    *                                           type: string
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
    */
    router.get('/', furnitureController.userFurnitureByPage);

    return app.use('/api/shop', router);
}

const FurnitureCategoryRouter = (app) => {
    const router = express.Router();

    /**
    * @swagger
    * /api/furniture-category:
    *  get:
    *      tags:
    *           - Furnitures
    *      summary: Get furniture by classificationId
    *      description: This endpoint is for getting furniture by classificationId
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
    *          - in: query
    *            name: classificationId
    *            required: true
    *            description: For finding
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
    *                                       colors:
    *                                           type: array
    *                                           items:
    *                                               type: object
    *                                               properties:
    *                                                   id:
    *                                                       type: string
    *                                                   name:
    *                                                       type: string
    *                                                   count:
    *                                                       type: number
    *                                       materials:
    *                                           type: array
    *                                           items:
    *                                               type: object
    *                                               properties:
    *                                                   id:
    *                                                       type: string
    *                                                   name:
    *                                                       type: string
    *                                                   count:
    *                                                       type: number
    *                                       furnitures:
    *                                           type: array
    *                                           items:
    *                                               $ref: '#components/schemas/FurnitureData'
    *                                       page:
    *                                           type: string
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
    */
    router.get('/', furnitureController.furnitureByClassificationId);

    return app.use('/api/furniture-category', router);
}

export {
    FurnitureRouter,
    ShopRouter,
    FurnitureCategoryRouter
}
