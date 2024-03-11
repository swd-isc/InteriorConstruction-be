import express from 'express';
import { isCurrentUser, verifyToken } from '../middleware/authen';
import { paymentController } from '../controller/PaymentController';

const router = express.Router();

const PaymentRouter = (app) => {
    router.get('/create_payment', function (req, res, next) {
        res.render('order', { title: 'Tạo mới đơn hàng', amount: 10000 })
    });

    /**
     * @swagger
     * /api/payment/create_payment:
     *  post:
     *      security:
     *          - bearerAuth: []
     *      tags:
     *          - Payments
     *      summary: Create payment URL
     *      description: |
     *          This endpoint is used to create a payment URL.
     *          The following parameters are expected in the request:
     *          - `bankCode`: The bank code, possible values are " ", "VNBANK", "INTCARD".
     *          - `language`: The language, possible values are " ", "vn", "en".
     *          Authorization is required, and the token should be provided in the request header.
     *      requestBody:
     *          required: true
     *          content:
     *            application/json:
     *              schema:
     *                type: object
     *                properties:
     *                  contractId:
     *                    type: string
     *                  amount:
     *                    type: number
     *                  bankCode:
     *                    type: string
     *                  language:
     *                    type: string
     *      responses:
     *        201:
     *          description: Ok
     *          content:
     *            application/json:
     *              schema:
     *                type: object
     *                properties:
     *                  status:
     *                    type: number
     *                  paymentURL:
     *                    type: string
     *                  message:
     *                    type: string
     *        400:
     *          description: Bad request
     *          content:
     *            application/json:
     *              schema:
     *                type: object
     *                properties:
     *                  status:
     *                    type: number
     *                  data:
     *                    type: object
     *                  messageError:
     *                    type: string
     *        500:
     *          description: Server error
     *          content:
     *            application/json:
     *              schema:
     *                type: object
     *                properties:
     *                  status:
     *                    type: number
     *                  messageError:
     *                    type: string
     *        401:
     *             description: Unauthorized
     *             content:
     *                  application/json:
     *                      schema:
     *                          type: string
     *        403:
     *             description: Forbidden
     *             content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              messageError:
     *                                type: string 
     */
    // router.post('/create_payment', verifyToken, isCurrentUser, paymentController.postPayment);
    router.post('/create_payment', paymentController.postPayment);

    router.post('/querydr', paymentController.postQuery);

    router.post('/refund', paymentController.postRefund);

    router.get('/return', paymentController.returnPayment);

    router.get('/', function (req, res, next) {
        res.render('orderlist', { title: 'Danh sách đơn hàng' })
    });

    return app.use('/api/payment', router);
}

export {
    PaymentRouter
}
