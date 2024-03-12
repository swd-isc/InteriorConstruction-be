import moment from 'moment';
import { vnPay } from '../config/vnpayConfig';
import queryString from 'qs';
import crypto from 'crypto';
import request from 'request';
import util from 'util';
import Refund from "../models/Refund";
import Contract from "../models/Contract";
import Client from "../models/Client";
import { orderRepository } from './OrderServices';
const requestPromise = util.promisify(request);

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
        const contractId = req.body.contractId;
        const orderId = req.body.contractId;
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

        console.log('check ', orderId);
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
        const reqBody = {
            vnp_Amount: vnp_Params['vnp_Amount'],
            vnp_BankCode: vnp_Params['vnp_BankCode'],
            vnp_BankTranNo: vnp_Params['vnp_BankTranNo'],
            vnp_CardType: vnp_Params['vnp_CardType'],
            vnp_PayDate: vnp_Params['vnp_PayDate'],
            vnp_OrderInfo: vnp_Params['vnp_OrderInfo'],
            vnp_TransactionNo: vnp_Params['vnp_TransactionNo'],
            vnp_BankTranNo: vnp_Params['vnp_BankTranNo'],
            vnp_BankTranNo: vnp_Params['vnp_BankTranNo'],
            vnp_BankTranNo: vnp_Params['vnp_BankTranNo'],
            vnp_BankTranNo: vnp_Params['vnp_BankTranNo'],
            vnp_BankTranNo: vnp_Params['vnp_BankTranNo'],
        }
        const data = orderRepository.createOrder()
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
        const vnp_RequestId = moment(adjustedDate).format('YYYYMMDDHHmmss');

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
            const response = await requestPromise({
                url: vnp_Api,
                method: "POST",
                json: true,
                body: dataObj
            });

            console.log('check res', response.body);
            return response.body;
        } catch (error) {
            console.error('Error in queryPayment:', error);
            throw error;
        }
    },

    refund: async (req) => {
        const vnp_TmnCode = vnPay.vnp_TmnCode;
        const secretKey = vnPay.vnp_HashSecret;
        const vnp_Api = vnPay.vnp_Api;

        const date = new Date();
        const vnp_TxnRef = req.body.orderId;
        const vnp_TransactionDate = req.body.transDate;
        const vnp_Amount = req.body.amount * 100;
        const vnp_TransactionType = req.body.transType;
        const vnp_CreateBy = req.body.user;

        const timezoneOffsetMinutes = 7 * 60; // UTC+7
        const adjustedDate = new Date(date.getTime() + timezoneOffsetMinutes * 60000);
        const vnp_RequestId = moment(adjustedDate).format('HHmmss');
        const vnp_Version = '2.1.0';
        const vnp_Command = 'refund';
        const vnp_OrderInfo = 'Refund order: ' + vnp_TxnRef;
        const vnp_IpAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;


        const vnp_CreateDate = moment(adjustedDate).format('YYYYMMDDHHmmss')

        const vnp_TransactionNo = '0';

        const data = vnp_RequestId + "|" + vnp_Version + "|" + vnp_Command + "|" + vnp_TmnCode + "|" + vnp_TransactionType + "|" + vnp_TxnRef + "|" + vnp_Amount + "|" + vnp_TransactionNo + "|" + vnp_TransactionDate + "|" + vnp_CreateBy + "|" + vnp_CreateDate + "|" + vnp_IpAddr + "|" + vnp_OrderInfo;
        const hmac = crypto.createHmac("sha512", secretKey);
        const vnp_SecureHash = hmac.update(new Buffer(data, 'utf-8')).digest("hex");

        const dataObj = {
            'vnp_RequestId': vnp_RequestId,
            'vnp_Version': vnp_Version,
            'vnp_Command': vnp_Command,
            'vnp_TmnCode': vnp_TmnCode,
            'vnp_TransactionType': vnp_TransactionType,
            'vnp_TxnRef': vnp_TxnRef,
            'vnp_Amount': vnp_Amount,
            'vnp_TransactionNo': vnp_TransactionNo,
            'vnp_CreateBy': vnp_CreateBy,
            'vnp_OrderInfo': vnp_OrderInfo,
            'vnp_TransactionDate': vnp_TransactionDate,
            'vnp_CreateDate': vnp_CreateDate,
            'vnp_IpAddr': vnp_IpAddr,
            'vnp_SecureHash': vnp_SecureHash
        };

        console.log(dataObj)

        try {
            const response = await requestPromise({
                url: vnp_Api,
                method: "POST",
                json: true,
                body: dataObj
            });

            console.log(response.body);

            const responseCode = response.body.vnp_ResponseCode;

            if (responseCode == '00') {
                const transactionType =
                  response.body.vnp_TransactionType == "02"
                    ? "Giao dịch hoàn trả toàn phần"
                    : "Giao dịch hoàn trả một phần";

                let transactionStatus = "";

                switch (response.body.vnp_TransactionStatus) {
                  case "00":
                    transactionStatus = "Giao dịch thanh toán thành công";
                    break;

                  case "01":
                    transactionStatus = "Giao dịch chưa hoàn tất";
                    break;

                  case "02":
                    transactionStatus = "Giao dịch bị lỗi";
                    break;

                  case "04":
                    transactionStatus =
                      "Giao dịch đảo (Khách hàng đã bị trừ tiền tại Ngân hàng nhưng GD chưa thành công ở VNPAY)";
                    break;

                  case "05":
                    transactionStatus =
                      "VNPAY đang xử lý giao dịch này (GD hoàn tiền)";
                    break;

                  case "06":
                    transactionStatus =
                      "VNPAY đã gửi yêu cầu hoàn tiền sang Ngân hàng (GD hoàn tiền)";
                    break;

                  case "07":
                    transactionStatus = "Giao dịch bị nghi ngờ gian lận";
                    break;

                  case "09":
                    transactionStatus = "GD Hoàn trả bị từ chối";
                    break;

                  default:
                    break;
                }

                const dateString = response.body.vnp_PayDate;
                const year = dateString.substring(0, 4);
                const month = dateString.substring(4, 6);
                const day = dateString.substring(6, 8);
                const hours = dateString.substring(8, 10);
                const minutes = dateString.substring(10, 12);
                const seconds = dateString.substring(12, 14);
                
                const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

                console.log("date " + formattedDate);

                console.log("txnRef: " + response.body.vnp_TxnRef);

                const contract = await Contract.findById(response.body.vnp_TxnRef);

                console.log("contract " + contract);

                const refund = new Refund({
                    vnp_TxnRef: response.body.vnp_TxnRef,
                    vnp_Amount: response.body.Amount,
                    vnp_OrderInfo: response.body.OrderInfo,
                    vnp_BankCode: response.body.BankCode,
                    vnp_PayDate: formattedDate,
                    vnp_TransactionNo: response.body.TransactionNo,
                    vnp_TransactionType: transactionType,
                    vnp_TransactionStatus: transactionStatus,
                    contractId: contract._id,
                    clientId: contract.clientId
                })

                console.log("ref " + refund);

                try {
                  const url = process.env.URL_DB;
                  await mongoose.connect(url, {
                    family: 4,
                    dbName: "interiorConstruction",
                  });

                  const data = await refund.save();

                  return {
                    status: 200,
                    data: data,
                    message: data.length !== 0 ? "OK" : "No data",
                  };
                } catch (error) {
                  console.error(error);
                  return {
                    status: 400,
                    messageError: error.toString(),
                  };
                } finally {
                  // Close the database connection
                  mongoose.connection.close();
                }
                

            } else {
                let messageError = '';
                switch (responseCode) {
                    case '02':
                        messageError = 'Mã định danh kết nối không hợp lệ';
                        break;
                        
                    case '03':
                        messageError = 'Dữ liệu gửi sang không đúng định dạng';
                        break;

                    case '91':
                        messageError = 'Không tìm thấy giao dịch yêu cầu hoàn trả';
                        break;

                    case '94':
                        messageError = 'Giao dịch đã được gửi yêu cầu hoàn tiền trước đó. Yêu cầu này VNPAY đang xử lý';
                        break;
                    
                    case '95':
                        messageError = 'Giao dịch này không thành công bên VNPAY. VNPAY từ chối xử lý yêu cầu';
                        break;

                    case '97':
                        messageError = 'Checksum không hợp lệ';
                        break;  
                        
                    case '99':
                        messageError = 'Các lỗi khác';
                        break;

                    default:
                        break;
                }
                return {
                    status: 400,
                    data: {},
                    messageError
                }
            }

        } catch (error) {
            console.log("error in refund: " + error);
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