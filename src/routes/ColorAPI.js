import express from 'express';
import { getColorById, getColorData } from '../controller/ColorController';

const router = express.Router();

const ColorRouter = (app) => {
    router.get('/page/:page', getColorData);
    router.get('/:id', getColorById);

    return app.use('/color', router);
}

export {
    ColorRouter
}
