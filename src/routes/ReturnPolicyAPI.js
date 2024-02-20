import express from 'express';
import { deleteReturnPolicyController, getReturnPolicyById, postReturnPolicyController, putReturnPolicyController } from '../controller/ReturnPolicyController';

const router = express.Router();

const ReturnPolicyRouter = (app) => {
    router.get('/:id', getReturnPolicyById);
    router.post('/', postReturnPolicyController);
    router.put('/', putReturnPolicyController);
    router.put('/:id', putReturnPolicyController);
    router.delete('/:id', deleteReturnPolicyController);
    router.delete('/', deleteReturnPolicyController);

    return app.use('/api/return-policy', router);
}

export {
    ReturnPolicyRouter
}
