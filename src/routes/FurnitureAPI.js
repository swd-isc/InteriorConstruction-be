import express from 'express';
import { furnitureByClassification, furnitureById, furnitureByPage, furnitureByType } from '../controller/FurnitureController';

const router = express.Router();

const FurnitureRouter = (app) => {
    router.get('/:id', furnitureById);
    router.get('/page/:page', furnitureByPage);
    router.get('/type/:type', furnitureByType);
    router.get('/classification/:classification', furnitureByClassification);

    return app.use('/furniture', router);
}

export {
    FurnitureRouter
}
