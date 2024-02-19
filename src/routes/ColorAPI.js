import express from 'express';
import { getColorById, getColorData, postColorController } from '../controller/ColorController';

const router = express.Router();

const ColorRouter = (app) => {
    router.get('/page', getColorData);
    router.get('/page/:page', getColorData);
    router.get('/:id', getColorById);
    router.get('/', getColorById);
    router.post('/', postColorController);

    return app.use('/api/color', router);
}

export {
    ColorRouter
}
