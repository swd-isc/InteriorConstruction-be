import express from 'express';
import { getReturnPolicyById, postReturnPolicyController } from '../controller/ReturnPolicyController';

const router = express.Router();

const ReturnPolicyRouter = (app) => {
    router.get('/:id', getReturnPolicyById);
    router.post('/', postReturnPolicyController);

    return app.use('/api/return-policy', router);
}

export {
    ReturnPolicyRouter
}
