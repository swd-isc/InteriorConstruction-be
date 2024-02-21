import express from 'express';
import { furnitureController } from '../controller/FurnitureController';

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
