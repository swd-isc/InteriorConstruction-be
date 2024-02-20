import express from 'express';
import { getClassificationByType, getClassificationByPage, postClassificationController, putClassificationController, deleteClassificationController } from '../controller/ClassificationController';

const router = express.Router();

const ClassificationRouter = (app) => {
    router.get('/page/:page', getClassificationByPage);
    router.get('/', getClassificationByType);
    router.post('/', postClassificationController);
    router.put('/', putClassificationController);
    router.put('/:id', putClassificationController);
    router.delete('/:id', deleteClassificationController);
    router.delete('/', deleteClassificationController);

    return app.use('/api/classification', router);
}

export {
    ClassificationRouter
}
