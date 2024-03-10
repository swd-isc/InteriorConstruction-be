import express from 'express';
import { verifyToken } from '../middleware/authen';
import { paymentController } from '../controller/PaymentController';

const router = express.Router();

const PaymentRouter = (app) => {
    router.post('/create_payment', verifyToken, paymentController.postPayment);

    return app.use('/api/payment', router);
}

export {
    PaymentRouter
}
