import express from 'express';
import { colorController } from '../controller/ColorController';

const router = express.Router();

const ColorRouter = (app) => {
    router.get('/page', colorController.getColorData);
    router.get('/page/:page', colorController.getColorData);
    router.get('/:id', colorController.getColorById);
    router.get('/', colorController.getColorById);
    router.post('/', colorController.postColorController);
    router.put('/', colorController.putColorController);
    router.put('/:id', colorController.putColorController);
    router.delete('/:id', colorController.deleteColorController);
    router.delete('/', colorController.deleteColorController);

    return app.use('/api/color', router);
}

export {
    ColorRouter
}
