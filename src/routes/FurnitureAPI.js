import express from 'express';
import { furnitureByClassificationByName, furnitureByClassificationByType, furnitureByClassificationId, furnitureByColor, furnitureById, furnitureByMaterial, furnitureByPage, furnitureByType } from '../controller/FurnitureController';

const FurnitureRouter = (app) => {
    const router = express.Router();

    router.get('/price/', furnitureByPage);
    router.get('/price/:page/:asc', furnitureByPage);
    router.get('/price/:asc', furnitureByPage);
    router.get('/type/', furnitureByType);
    router.get('/type/:type', furnitureByType);
    router.get('/classification/type/', furnitureByClassificationByType);
    router.get('/classification/type/:type', furnitureByClassificationByType);
    router.get('/classification/name/', furnitureByClassificationByName);
    router.get('/classification/name/:name', furnitureByClassificationByName);
    router.get('/material/', furnitureByMaterial);
    router.get('/material/:materialName', furnitureByMaterial);
    router.get('/color/', furnitureByColor);
    router.get('/color/:colorName', furnitureByColor);
    router.get('/', furnitureById);

    return app.use('/api/furniture', router);
}

const ShopRouter = (app) => {
    const router = express.Router();

    router.get('/', furnitureByPage);

    return app.use('/api/shop', router);
}

const FurnitureCategoryRouter = (app) => {
    const router = express.Router();

    router.get('/', furnitureByClassificationId);

    return app.use('/api/furniture-category', router);
}

export {
    FurnitureRouter,
    ShopRouter,
    FurnitureCategoryRouter
}
