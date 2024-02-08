import express from 'express';
import { getFurnitureData } from '../../controller/furniture-controller/FurnitureController';

const router = express.Router();

const FurnitureRouter = (app) => {
    router.get('/page/:page', getFurnitureData);

    return app.use('/furniture', router);
}

export {
    FurnitureRouter
}
