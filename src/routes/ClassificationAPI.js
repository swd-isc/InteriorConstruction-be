import express from 'express';
import { getClassificationByType, getClassificationByPage, postClassificationController, putClassificationController } from '../controller/ClassificationController';

const router = express.Router();

const ClassificationRouter = (app) => {
    router.get('/page/:page', getClassificationByPage);
    router.get('/', getClassificationByType);
    router.post('/', postClassificationController);
    router.put('/', putClassificationController);
    router.put('/:id', putClassificationController);

    return app.use('/api/classification', router);
}

export {
    ClassificationRouter
}
