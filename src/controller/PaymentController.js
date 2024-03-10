import { paymentService } from "../services/PaymentServices";

export const paymentController = {
    postPayment: (req, res, next) => {
        let data = paymentService.createPayment(req, res);
        return res.status(data.status).json(data);
    }
}