import express from 'express';
import { furnitureController } from '../controller/FurnitureController';

/**
 * @swagger
 *  components:
 *      schemas:
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
 *          ColorData:
 *              type: object
 *              properties:
 *                  id:
 *                      type: string
 *                  name:
 *                      type: string
 *                  count:
 *                      type: number
 *          MaterialData:
 *              type: object
 *              properties:
 *                  id:
 *                      type: string
 *                  name:
 *                      type: string
 *                  count:
 *                      type: number
 */

const FurnitureRouter = (app) => {
    const router = express.Router();

    router.get('/price/', furnitureController.furnitureByPage);
    router.get('/price/:page/:asc', furnitureController.furnitureByPage);
    router.get('/price/:asc', furnitureController.furnitureByPage);
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
    * /api/furniture/{id}:
    *  get:
    *      tags:
    *           - Furnitures
    *      summary: Get furniture by id
    *      description: This endpoint is for getting furniture by id
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
    */
    router.get('/:id', furnitureController.furnitureById);
    router.get('/', furnitureController.furnitureById);


    router.post('/', furnitureController.createFurController);


    router.put('/', furnitureController.updateFurController);
    router.put('/:id', furnitureController.updateFurController);


    router.delete('/:id', furnitureController.deleteFurController);
    router.delete('/', furnitureController.deleteFurController);

    return app.use('/api/furniture', router);
}

const ShopRouter = (app) => {
    const router = express.Router();
    router.get('/filter-session', furnitureController.filterSession);
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
    router.get('/', furnitureController.furnitureByPage);

    return app.use('/api/shop', router);
}

const FurnitureCategoryRouter = (app) => {
    const router = express.Router();

    router.get('/', furnitureController.furnitureByClassificationId);

    return app.use('/api/furniture-category', router);
}

export {
    FurnitureRouter,
    ShopRouter,
    FurnitureCategoryRouter
}
