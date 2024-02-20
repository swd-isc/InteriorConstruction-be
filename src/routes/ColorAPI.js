import express from 'express';
import { deleteColorController, getColorById, getColorData, postColorController, putColorController } from '../controller/ColorController';

const router = express.Router();

const ColorRouter = (app) => {
    router.get('/page', getColorData);
    router.get('/page/:page', getColorData);
    router.get('/:id', getColorById);
    router.get('/', getColorById);
    router.post('/', postColorController);
    router.put('/', putColorController);
    router.put('/:id', putColorController);
    router.delete('/:id', deleteColorController);
    router.delete('/', deleteColorController);

    return app.use('/api/color', router);
}

export {
    ColorRouter
}
