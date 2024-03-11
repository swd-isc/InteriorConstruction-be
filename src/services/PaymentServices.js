import moment from 'moment';
import { vnPay } from '../config/vnpayConfig';
import queryString from 'qs';
import crypto from 'crypto';

export const paymentService = {
    createPayment: async (req) => {
        const ipAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        const date = new Date();
        const timezoneOffsetMinutes = 7 * 60; // UTC+7
        const adjustedDate = new Date(date.getTime() + timezoneOffsetMinutes * 60000);
        const createDate = moment(adjustedDate).format('YYYYMMDDHHmmss');

        const tmnCode = vnPay.vnp_TmnCode;
        const secretKey = vnPay.vnp_HashSecret;
        let vnpUrl = vnPay.vnp_Url;
        const returnUrl = vnPay.vnp_ReturnUrl;
        const orderId = req.body.contractId;
        const amount = req.body.amount;
        const bankCode = req.body.bankCode;
        console.log('check req', bankCode, ',', req.body.language);

        let locale = req.body.language;
        if (locale === null || locale === '') {
            locale = 'vn';
        }
        const currCode = 'VND';
        let vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        vnp_Params['vnp_Locale'] = locale;
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = 'Payment for contract: ' + orderId;
        vnp_Params['vnp_OrderType'] = 'other';
        vnp_Params['vnp_Amount'] = amount * 100; //merchant cần nhân thêm 100 lần (khử phần thập phân)
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;

        if (bankCode !== null && bankCode !== '') {
            vnp_Params['vnp_BankCode'] = bankCode;
        }

        vnp_Params = sortObject(vnp_Params);

        const signData = queryString.stringify(vnp_Params, { encode: false });
        const hmac = crypto.createHmac("sha512", secretKey);
        const signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");

        vnp_Params['vnp_SecureHash'] = signed;

        vnpUrl += '?' + queryString.stringify(vnp_Params, { encode: false });

        return vnpUrl;
    },

    returnPayment: async (req) => {
        let vnp_Params = req.query;

        const secureHash = vnp_Params['vnp_SecureHash'];

        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        vnp_Params = sortObject(vnp_Params);

        const tmnCode = vnPay.vnp_TmnCode;
        const secretKey = vnPay.vnp_HashSecret;

        const signData = queryString.stringify(vnp_Params, { encode: false });
        const hmac = crypto.createHmac("sha512", secretKey);
        const signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");


        console.log('check vnp_Params', vnp_Params);
        if (secureHash === signed) {
            //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
            console.log('check code: ', vnp_Params['vnp_ResponseCode']);
            return {
                code: vnp_Params['vnp_ResponseCode']
            }
        } else {
            console.log('check code: 97');

            return {
                code: '97'
            }
        }
    }
}

function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}