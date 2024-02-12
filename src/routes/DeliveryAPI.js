import express from 'express';
import { getDeliveryById } from '../controller/DeliveryController';

const router = express.Router();

const DeliveryRouter = (app) => {
    router.get('/:id', getDeliveryById);

    return app.use('/delivery', router);
}

export {
    DeliveryRouter
}
