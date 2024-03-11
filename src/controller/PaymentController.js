import { paymentService } from "../services/PaymentServices";

export const paymentController = {
    postPayment: async (req, res, next) => {
        const vnpUrl = await paymentService.createPayment(req);
        return res.redirect(vnpUrl);
        // return res.status(200).json({
        //     status: 200,
        //     paymentURL: vnpUrl,
        //     message: "ok"
        // });
    },

    returnPayment: async (req, res, next) => {
        const data = await paymentService.returnPayment(req);
        return res.render('success', { code: data.code });
    },

    postQuery: async (req, res, next) => {

    }
}