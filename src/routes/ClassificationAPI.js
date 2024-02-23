import express from 'express';
import { classificationController } from '../controller/ClassificationController';

const router = express.Router();

const ClassificationRouter = (app) => {
    router.get('/page/:page', classificationController.getClassificationByPage);
    router.get('/', classificationController.getClassificationByType);
    router.post('/', classificationController.postClassificationController);
    router.put('/', classificationController.putClassificationController);
    router.put('/:id', classificationController.putClassificationController);
    router.delete('/:id', classificationController.deleteClassificationController);
    router.delete('/', classificationController.deleteClassificationController);

    return app.use('/api/classification', router);
}

export {
    ClassificationRouter
}
