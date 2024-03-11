import express from 'express';
import { verifyToken } from '../middleware/authen';
import { paymentController } from '../controller/PaymentController';

const router = express.Router();

const PaymentRouter = (app) => {
    router.get('/create_payment', function (req, res, next) {
        res.render('order', { title: 'Tạo mới đơn hàng', amount: 10000 })
    });

    router.post('/create_payment', paymentController.postPayment);

    router.get('/return', paymentController.returnPayment);

    router.get('/', function (req, res, next) {
        res.render('orderlist', { title: 'Danh sách đơn hàng' })
    });

    return app.use('/api/payment', router);
}

export {
    PaymentRouter
}
