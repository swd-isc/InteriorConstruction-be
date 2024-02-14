import express from 'express';
import { getClassificationByType, getClassificationByPage } from '../controller/ClassificationController';

const router = express.Router();

const ClassificationRouter = (app) => {
    router.get('/page/:page', getClassificationByPage);
    router.get('/', getClassificationByType);

    return app.use('/api/classification', router);
}

export {
    ClassificationRouter
}
