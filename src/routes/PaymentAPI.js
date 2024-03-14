import express from 'express';
import { isClient, verifyToken } from '../middleware/authen';
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
     *      summary: Create contract and payment URL
     *      description: |
     *          This endpoint is used to create contract and payment URL.
     *          The following parameters are expected in the request:
     *          - `contractId`: For create payment URL only. If don't have this param will create new contract
     *          - `bankCode`: The bank code, possible values are `" "`, `"VNBANK"`, `"INTCARD"`.
     *          - `language`: The language, possible values are `" "`, `"vn"`, `"en"`.
     *          Authorization is required, and the token should be provided in the request header.
     *          This endpoint is for `Client only`, Admin cannot access this endpoint
     *          - `amount`: Total prices
     *          - `furnitures`: Array of furnitureId. Ex: `[{furnitureId: "furnitureId1", quantity: 2}, {furnitureId: "furnitureId2", quantity: 1}, {furnitureId: "furnitureId3", quantity: 4}]`
     *          - `designs`: Array of designId. Ex: `[{designId: "designId1", quantity: 1}, {designId: "designId1", quantity: 2}, {designId: "designId1", quantity: 3}]`
     *      requestBody:
     *          content:
     *            application/json:
     *              schema:
     *                type: object
     *                properties:
     *                  contractId:
     *                    type: string
     *                  furnitures:
     *                    type: array
     *                    items:
     *                          type: object
     *                          properties:
     *                              furnitureId:
     *                                  type: string
     *                              quantity:
     *                                  type: number
     *                  designs:
     *                    type: array
     *                    items:
     *                          type: object
     *                          properties:
     *                              designId:
     *                                  type: string
     *                              quantity:
     *                                  type: number
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
    router.post('/create_payment', verifyToken, isClient, paymentController.postPayment);
    // router.post('/create_payment', paymentController.postPayment);

    router.post('/querydr', paymentController.postQuery);

    /**
     * @swagger
     * /api/payment/refund:
     *  post:
     *      security:
     *          - bearerAuth: []
     *      tags:
     *          - Payments
     *      summary: Refund payment
     *      description: |
     *          This endpoint is used to refund a payment.
     *          The following parameters are expected in the request:
     *          - `user`: Author create request
     *          - `orderId`: OrderId is contractId
     *          Authorization is required, and the token should be provided in the request header.
     *          This endpoint is for `Client only`, Admin cannot access this endpoint
     *          - `amount`: Price want to refund (remember this price must `10000 <= x <= Total price`)
     *          - `transDate`: Date create payment (Ex: `20240312164311`) (Required)
     *          - `transType`: Type (2 options - "02" || "03")
     *          -       "02": Giao dịch hoàn trả toàn phần (vnp_TransactionType=02)
     *          -       "03": Giao dịch hoàn trả một phần (vnp_TransactionType=03)
     *      requestBody:
     *          required: true
     *          content:
     *            application/json:
     *              schema:
     *                type: object
     *                properties:
     *                  user:
     *                    type: string
     *                  orderId:
     *                    type: string
     *                  amount:
     *                    type: number
     *                  transDate:
     *                    type: string
     *                  transType:
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
     *                  data:
     *                    $ref: '#components/schemas/RefundData'
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
    router.post('/refund', verifyToken, isClient, paymentController.postRefund);
    // router.post('/refund', paymentController.postRefund);

    router.get('/return', paymentController.returnPayment);

    router.get('/', function (req, res, next) {
        res.render('orderlist', { title: 'Danh sách đơn hàng' })
    });

    return app.use('/api/payment', router);
}

export {
    PaymentRouter
}
