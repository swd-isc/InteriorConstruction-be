import express from 'express';
import { furnitureByClassificationByName, furnitureByClassificationByType, furnitureByColor, furnitureById, furnitureByMaterial, furnitureByPage, furnitureByType } from '../controller/FurnitureController';

const router = express.Router();

const FurnitureRouter = (app) => {
    router.get('/page/', furnitureByPage);
    router.get('/page/:page', furnitureByPage);
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
    router.get('/:id', furnitureById);

    return app.use('/furniture', router);
}

export {
    FurnitureRouter
}
