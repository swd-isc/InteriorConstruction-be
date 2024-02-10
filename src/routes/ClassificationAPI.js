import express from 'express';
import { getClassificationData } from '../controller/ClassificationController';

const router = express.Router();

const ClassificationRouter = (app) => {
    router.get('/page/:page', getClassificationData);

    return app.use('/classification', router);
}

export {
    ClassificationRouter
}
