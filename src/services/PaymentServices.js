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
import Order from '../models/Order';
import mongoose from 'mongoose';
import { contractRepository } from './ContractServices';
const requestPromise = util.promisify(request);

const ObjectId = mongoose.Types.ObjectId;

export const paymentService = {
  createPayment: async (req) => {
    // const testData = {
    //   clientId: "65e845ac4cb2b21ac2aa90ea",
    //   furnitures: [
    //     {
    //       furnitureId: "65c3beba4c0026f21a53e8fc",
    //       quantity: 2
    //     }
    //   ],
    //   designs: [
    //     {
    //       designId: "65c473cf001c75da569f8711",
    //       quantity: 2
    //     }
    //   ],
    //   contractPrice: 250000
    // }

    let contractId = req.body.contractId;

    if (contractId === null || contractId === '' || contractId === undefined) {
      const contractReq = {
        clientId: req.user.id.toString(),
        furnitures: req.body.furnitures,
        designs: req.body.designs,
        contractPrice: req.body.amount
      }
      const data = await contractRepository.createContract(contractReq);
      // const data = await contractRepository.createContract(testData);

      if (data.status !== 201) {
        return {
          status: data.status,
          data: {},
          messageError: data.messageError
        }
      }
      contractId = data.data._id;
    } else {
      const isValid = await isIdValid(contractId, 'contract');
      if (!isValid.isValid) {
        return {
          status: isValid.status,
          data: {},
          messageError: isValid.messageError
        }
      }
    }

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

    const amount = req.body.amount;
    const bankCode = req.body.bankCode;

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
    vnp_Params['vnp_TxnRef'] = createDate;
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

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);

    let reqBody = {};

    let message = "";
    let responseData = {}
    switch (vnp_Params['vnp_ResponseCode']) {
      case '00':
        try {
          message = "Giao dịch thành công";
          const url = process.env.URL_DB;
          await mongoose.connect(url, { family: 4, dbName: 'interiorConstruction' });
          const contractId = extractContractId(vnp_Params['vnp_OrderInfo']);

          const data = await Contract.findById(contractId);

          if (data) {
            data.status = "PROCESSING";

            await data.save();
          }
          const orderInfo = decodePaymentString(vnp_Params['vnp_OrderInfo'].replace(/\+/g, ' '));

          const amount = vnp_Params['vnp_Amount'] / 100;

          let transactionStatus = '';
          switch (vnp_Params['vnp_TransactionStatus']) {
            case '00':
              transactionStatus = "Giao dịch thành công";
              break;
            case '01':
              transactionStatus = "Giao dịch chưa hoàn tất";
              break;
            case '02':
              transactionStatus = "Giao dịch bị lỗi";
              break;
            case '04':
              transactionStatus = "Giao dịch đảo (Khách hàng đã bị trừ tiền tại Ngân hàng nhưng GD chưa thành công ở VNPAY)";
              break;
            case '05':
              transactionStatus = "VNPAY đang xử lý giao dịch này (GD hoàn tiền)";
              break;
            case '06':
              transactionStatus = "VNPAY đã gửi yêu cầu hoàn tiền sang Ngân hàng (GD hoàn tiền)";
              break;
            case '07':
              transactionStatus = "Giao dịch bị nghi ngờ gian lận";
              break;
            case '09':
              transactionStatus = "GD Hoàn trả bị từ chối";
              break;

            default:
              transactionStatus = "Something with server";
              break;
          }
          reqBody = {
            vnp_Amount: amount,
            vnp_BankCode: vnp_Params['vnp_BankCode'],
            vnp_BankTranNo: vnp_Params['vnp_BankTranNo'],
            vnp_CardType: vnp_Params['vnp_CardType'],
            vnp_PayDate: vnp_Params['vnp_PayDate'],
            vnp_OrderInfo: orderInfo,
            vnp_TransactionNo: vnp_Params['vnp_TransactionNo'],
            vnp_TransactionStatus: transactionStatus,
            vnp_TxnRef: vnp_Params['vnp_TxnRef'],
            clientId: data.client.clientId,
            contractId: data._id,
          }

          const order = new Order(reqBody);
          await order.save();
          data.orderId = order._id;
          await data.save();

          responseData.message = message;
          responseData.orderId = order._id;
          responseData.clientId = data.client.clientId.toString();

        } catch (error) {
          console.log('err: ', error);
          responseData.message = "Something wrong with DB"
        } finally {
          // Close the database connection
          mongoose.connection.close();
        }

        break;
      case '07':
        message = 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).'
        responseData.message = message;
        break;
      case '09':
        message = 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.'
        responseData.message = message;
        break;
      case '10':
        message = 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần'
        responseData.message = message;
        break;
      case '11':
        message = 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.'
        responseData.message = message;
        break;
      case '12':
        message = 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.'
        responseData.message = message;
        break;
      case '13':
        message = 'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch.'
        responseData.message = message;
        break;
      case '24':
        message = 'Giao dịch không thành công do: Khách hàng hủy giao dịch'
        responseData.message = message;
        break;
      case '51':
        message = 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.'
        responseData.message = message;
        break;
      case '65':
        message = 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.'
        responseData.message = message;
        break;
      case '75':
        message = 'Ngân hàng thanh toán đang bảo trì.'
        responseData.message = message;
        break;
      case '79':
        message = 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch'
        responseData.message = message;
        break;
      case '99	':
        message = 'Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)'
        responseData.message = message;
        break;

      default:
        message = 'Something wrong with BE'
        responseData.message = message;
        break;
    }
    return encodeURIComponent(JSON.stringify(responseData));
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
    const vnp_TxnRef = req.body.vnp_TxnRef;
    const vnp_TransactionDate = req.body.transDate;
    const vnp_Amount = req.body.amount * 100;
    const vnp_TransactionType = req.body.transType;
    const vnp_CreateBy = req.body.user;
    const contractId = req.body.contractId;

    const timezoneOffsetMinutes = 7 * 60; // UTC+7
    const adjustedDate = new Date(
      date.getTime() + timezoneOffsetMinutes * 60000
    );
    const vnp_RequestId = moment(adjustedDate).format("HHmmss");
    const vnp_Version = "2.1.0";
    const vnp_Command = "refund";
    const vnp_OrderInfo = "Refund order: " + vnp_TxnRef;
    // const vnp_IpAddr =
    //   req.headers["x-forwarded-for"] ||
    //   req.connection.remoteAddress ||
    //   req.socket.remoteAddress ||
    //   req.connection.socket.remoteAddress;
    const vnp_IpAddr = "127.0.0.1";

    const vnp_CreateDate = moment(adjustedDate).format("YYYYMMDDHHmmss");

    const vnp_TransactionNo = "0";

    const data =
      vnp_RequestId +
      "|" +
      vnp_Version +
      "|" +
      vnp_Command +
      "|" +
      vnp_TmnCode +
      "|" +
      vnp_TransactionType +
      "|" +
      vnp_TxnRef +
      "|" +
      vnp_Amount +
      "|" +
      vnp_TransactionNo +
      "|" +
      vnp_TransactionDate +
      "|" +
      vnp_CreateBy +
      "|" +
      vnp_CreateDate +
      "|" +
      vnp_IpAddr +
      "|" +
      vnp_OrderInfo;
    const hmac = crypto.createHmac("sha512", secretKey);
    const vnp_SecureHash = hmac
      .update(new Buffer(data, "utf-8"))
      .digest("hex");

    const dataObj = {
      vnp_RequestId: vnp_RequestId,
      vnp_Version: vnp_Version,
      vnp_Command: vnp_Command,
      vnp_TmnCode: vnp_TmnCode,
      vnp_TransactionType: vnp_TransactionType,
      vnp_TxnRef: vnp_TxnRef,
      vnp_Amount: vnp_Amount,
      vnp_TransactionNo: vnp_TransactionNo,
      vnp_CreateBy: vnp_CreateBy,
      vnp_OrderInfo: vnp_OrderInfo,
      vnp_TransactionDate: vnp_TransactionDate,
      vnp_CreateDate: vnp_CreateDate,
      vnp_IpAddr: vnp_IpAddr,
      vnp_SecureHash: vnp_SecureHash,
    };

    try {
      const response = await requestPromise({
        url: vnp_Api,
        method: "POST",
        json: true,
        body: dataObj,
      });

      const responseCode = response.body.vnp_ResponseCode;

      if (responseCode == "00") {
        try {
          const url = process.env.URL_DB;
          await mongoose.connect(url, {
            family: 4,
            dbName: "interiorConstruction",
          });

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

          const formattedDate = response.body.vnp_PayDate;

          const contract = await Contract.findById(contractId);

          const refund = new Refund({
            vnp_TxnRef: response.body.vnp_TxnRef,
            vnp_Amount: response.body.vnp_Amount / 100,
            vnp_OrderInfo: response.body.vnp_OrderInfo,
            vnp_BankCode: response.body.vnp_BankCode,
            vnp_PayDate: formattedDate,
            vnp_TransactionNo: response.body.vnp_TransactionNo,
            vnp_TransactionType: transactionType,
            vnp_TransactionStatus: transactionStatus,
            contractId: contract._id,
            clientId: contract.client.clientId,
          });

          let data = await refund.save();
          data = await Refund.findById(data._id)
            .populate("clientId")
            .populate("contractId");

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
        let messageError = "";
        switch (responseCode) {
          case "02":
            messageError = "Mã định danh kết nối không hợp lệ";
            break;

          case "03":
            messageError = "Dữ liệu gửi sang không đúng định dạng";
            break;

          case "91":
            messageError = "Không tìm thấy giao dịch yêu cầu hoàn trả";
            break;

          case "93":
            messageError = "Số tiền hoàn trả lớn hơn số tiền đã giao dịch";
            break;

          case "94":
            messageError =
              "Giao dịch đã được gửi yêu cầu hoàn tiền trước đó. Yêu cầu này VNPAY đang xử lý";
            break;

          case "95":
            messageError =
              "Giao dịch này không thành công bên VNPAY. VNPAY từ chối xử lý yêu cầu";
            break;

          case "97":
            messageError = "Checksum không hợp lệ";
            break;

          case "99":
            messageError = "Các lỗi khác";
            break;

          default:
            break;
        }
        return {
          status: 400,
          data: {},
          messageError,
        };
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

async function isIdValid(id, model) {
  if (id === null || id === undefined) {
    return {
      status: 400,
      isValid: false,
      messageError: `ObjectId ${model} required.`,
    };
  }
  try {
    const url = process.env.URL_DB;
    await mongoose.connect(url, {
      family: 4,
      dbName: "interiorConstruction",
    });

    const isValidObjectId = mongoose.Types.ObjectId.isValid(id);

    if (!isValidObjectId) {
      // The provided id is not a valid ObjectId
      return {
        status: 400,
        isValid: false,
        messageError: `Not a valid ${model} ObjectId.`,
      };
    }

    let data = null;

    switch (model) {
      case "contract":
        // Check if the classification with the given ObjectId exists in the database
        data = await Contract.findById(id);
        break;
      case "client":
        // Check if the classification with the given ObjectId exists in the database
        data = await Client.findById(id);
        break;
      default:
        break;
    }

    if (data !== null) {
      return {
        isValid: true,
      };
    } else {
      return {
        status: 400,
        isValid: false,
        messageError: "ObjectId not found.",
      };
    }
    return data !== null; // Returns true if data exists, false otherwise
  } catch (error) {
    console.error("Error checking ObjectId:", error);
    return {
      status: 500,
      isValid: false,
      messageError: error,
    };
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
}

function decodePaymentString(encodedString) {
  // Giải mã URL
  const decodedString = decodeURIComponent(encodedString);

  // Thay thế "%3A" bằng ":"
  const formattedString = decodedString.replace(/%3A/g, ":");

  return formattedString;
}

function extractContractId(inputString) {
  const lastIndex = inputString.lastIndexOf('+');
  if (lastIndex !== -1) {
    return inputString.substring(lastIndex + 1);
  }
  return inputString; // If no '+' found, return the original string
}
