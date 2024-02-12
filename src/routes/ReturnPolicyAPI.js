import express from 'express';
import { getReturnPolicyById } from '../controller/ReturnPolicyController';

const router = express.Router();

const ReturnPolicyRouter = (app) => {
    router.get('/:id', getReturnPolicyById);

    return app.use('/return-policy', router);
}

export {
    ReturnPolicyRouter
}
