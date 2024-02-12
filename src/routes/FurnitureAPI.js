import express from 'express';
import { getFurniturePage, getFurnitureType } from '../controller/FurnitureController';

const router = express.Router();

const FurnitureRouter = (app) => {
    router.get('/page/:page', getFurniturePage);
    router.get('/type/:type', getFurnitureType);

    return app.use('/furniture', router);
}

export {
    FurnitureRouter
}
