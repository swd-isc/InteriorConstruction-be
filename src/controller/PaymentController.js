import { paymentService } from "../services/PaymentServices";

export const paymentController = {
    postPayment: async (req, res, next) => {
        console.log('check: ', req.body.contractId);
        const vnpUrl = await paymentService.createPayment(req);
        return res.redirect(vnpUrl);
    },

    returnPayment: async (req, res, next) => {
        const data = await paymentService.returnPayment(req);
        return res.render('success', { code: data.code });
    }
}