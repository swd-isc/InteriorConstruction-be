import express from 'express';
import { getColorData } from '../controller/ColorController';

const router = express.Router();

const ColorRouter = (app) => {
    router.get('/page/:page', getColorData);

    return app.use('/color', router);
}

export {
    ColorRouter
}