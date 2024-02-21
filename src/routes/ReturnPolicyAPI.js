import express from 'express';
import { returnPolicyController } from '../controller/ReturnPolicyController';

const router = express.Router();

const ReturnPolicyRouter = (app) => {
    router.get('/:id', returnPolicyController.getReturnPolicyById);
    router.post('/', returnPolicyController.postReturnPolicyController);
    router.put('/', returnPolicyController.putReturnPolicyController);
    router.put('/:id', returnPolicyController.putReturnPolicyController);
    router.delete('/:id', returnPolicyController.deleteReturnPolicyController);
    router.delete('/', returnPolicyController.deleteReturnPolicyController);

    return app.use('/api/return-policy', router);
}

export {
    ReturnPolicyRouter
}
