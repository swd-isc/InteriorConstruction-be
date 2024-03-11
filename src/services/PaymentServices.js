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
        // Tạo một giá trị số ngẫu nhiên (ví dụ: từ 0 đến 999)
        const randomValue = Math.floor(Math.random() * 1000);

        const tmnCode = vnPay.vnp_TmnCode;
        const secretKey = vnPay.vnp_HashSecret;
        let vnpUrl = vnPay.vnp_Url;
        const returnUrl = vnPay.vnp_ReturnUrl;
        const contractId = req.body.contractId;
        const orderId = `${createDate.toString()}${randomValue.toString()}`;
        const amount = req.body.amount;
        const bankCode = req.body.bankCode;
        console.log('check req', bankCode, ',', req.body.language);

        let locale = req.body.language;
        if (locale === null || locale === '' || locale === undefined) {
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
        vnp_Params['vnp_OrderInfo'] = 'Payment for contract: ' + contractId;
        vnp_Params['vnp_OrderType'] = 'other';
        vnp_Params['vnp_Amount'] = amount * 100; //merchant cần nhân thêm 100 lần (khử phần thập phân)
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;

        if (bankCode !== null && bankCode !== '' && bankCode !== undefined) {
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
    },

    queryPayment: async (req) => {
        const vnp_TmnCode = vnPay.vnp_TmnCode;
        const secretKey = vnPay.vnp_HashSecret;
        const vnp_Api = vnPay.vnp_Api;

        const vnp_TxnRef = req.body.orderId;
        const vnp_TransactionDate = req.body.transDate;

        const date = new Date();
        const timezoneOffsetMinutes = 7 * 60; // UTC+7
        const adjustedDate = new Date(date.getTime() + timezoneOffsetMinutes * 60000);
        const vnp_RequestId = moment(adjustedDate).format('HHmmss');

        const vnp_Version = '2.1.0';
        const vnp_Command = 'querydr';
        const vnp_OrderInfo = 'Query order: ' + vnp_TxnRef;

        const vnp_IpAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        const vnp_CreateDate = moment(adjustedDate).format('YYYYMMDDHHmmss');

        const data = vnp_RequestId + "|" + vnp_Version + "|" + vnp_Command + "|" + vnp_TmnCode + "|" + vnp_TxnRef + "|" + vnp_TransactionDate + "|" + vnp_CreateDate + "|" + vnp_IpAddr + "|" + vnp_OrderInfo;
        const hmac = crypto.createHmac("sha512", secretKey);
        const vnp_SecureHash = hmac.update(new Buffer(data, 'utf-8')).digest("hex");

        const dataObj = {
            'vnp_RequestId': vnp_RequestId,
            'vnp_Version': vnp_Version,
            'vnp_Command': vnp_Command,
            'vnp_TmnCode': vnp_TmnCode,
            'vnp_TxnRef': vnp_TxnRef,
            'vnp_OrderInfo': vnp_OrderInfo,
            'vnp_TransactionDate': vnp_TransactionDate,
            'vnp_CreateDate': vnp_CreateDate,
            'vnp_IpAddr': vnp_IpAddr,
            'vnp_SecureHash': vnp_SecureHash
        };
        console.log('here');

        // /merchant_webapi/api/transaction
        // request({
        //     url: vnp_Api,
        //     method: "POST",
        //     json: true,
        //     body: dataObj
        // }, function (error, response, body) {
        //     console.log('check res', response);
        // });
        try {
            const response = await request({
                url: vnp_Api,
                method: "POST",
                json: true,
                body: dataObj
            });

            console.log('check res', response);
            return response;
        } catch (error) {
            console.error('Error in queryPayment:', error);
            throw error;
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