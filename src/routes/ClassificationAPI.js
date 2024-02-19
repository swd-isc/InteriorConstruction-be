import express from 'express';
import { getClassificationByType, getClassificationByPage, postClassificationController } from '../controller/ClassificationController';

const router = express.Router();

const ClassificationRouter = (app) => {
    router.get('/page/:page', getClassificationByPage);
    router.get('/', getClassificationByType);
    router.post('/', postClassificationController);

    return app.use('/api/classification', router);
}

export {
    ClassificationRouter
}
