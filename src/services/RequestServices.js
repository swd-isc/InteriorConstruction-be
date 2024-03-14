import mongoose from "mongoose";
import Request from "../models/Request";
import Client from "../models/Client";
import Contract from "../models/Contract";
import moment from "moment";
import { paymentService } from "./PaymentServices";

const ObjectId = mongoose.Types.ObjectId;

export const requestRepository = {
  getRequests: async () => {
    try {
      const url = process.env.URL_DB;
      await mongoose.connect(url, {
        family: 4,
        dbName: "interiorConstruction",
      });

      const data = await Request.find().populate({
        path: 'clientId',
        select: 'firstName lastName'
      });

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
  },

  getRequestsByClientId: async (clientId) => {
    try {
      const url = process.env.URL_DB;
      await mongoose.connect(url, {
        family: 4,
        dbName: "interiorConstruction",
      });

      const data = await Request.find({ "clientId": clientId }).populate('clientId').populate('contractId');

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
  },

  getRequestById: async (id) => {
    try {

      const url = process.env.URL_DB;
      await mongoose.connect(url, {
        family: 4,
        dbName: "interiorConstruction",
      });

      const data = await Request.findById(id).populate('clientId').populate('contractId');

      return {
        status: 200,
        data: data,
        message: data !== 0 ? "OK" : "No data",
      };
    } catch (error) {
      console.error(error);
      return {
        status: 500,
        messageError: error.toString(),
      };
    } finally {
      // Close the database connection
      mongoose.connection.close();
    }
  },



  createRequest: async (reqBody) => {
    try {
      let data = [];
      const url = process.env.URL_DB;
      await mongoose.connect(url, {
        family: 4,
        dbName: "interiorConstruction",
      });

      const date = new Date();
      const timezoneOffsetMinutes = 7 * 60; // UTC+7
      const adjustedDate = new Date(date.getTime() + timezoneOffsetMinutes * 60000);
      const createDate = moment(adjustedDate).format('YYYYMMDDHHmmss');

      const requestBody = {
        clientId: reqBody.clientId,
        contractId: reqBody.contractId,
        status: "DEFAULT",
        date: createDate
      }

      const isExist = await Request.find({ clientId: reqBody.clientId, contractId: reqBody.contractId });
      if (isExist.length > 0) {
        return {
          status: 400,
          data: {},
          messageError: "You are refund before, please try again later.",
        };
      }

      const request = new Request(requestBody);

      try {
        data = await request.save();
      } catch (error) {
        return {
          status: 400,
          data: {},
          messageError: error.message,
        };
      }

      return {
        status: 201,
        data: data,
        message: data.length !== 0 ? "OK" : "No data",
      };
    } catch (error) {
      console.error("error ne", error);
      return {
        status: 500,
        messageError: error.toString(),
      };
    } finally {
      // Close the database connection
      mongoose.connection.close();
    }
  },

  updateRequest: async (requestId, reqBody) => {
    try {
      let data = {};

      const url = process.env.URL_DB;
      await mongoose.connect(url, {
        family: 4,
        dbName: "interiorConstruction",
      });

      const reqStatus = reqBody.status;
      try {
        if (reqStatus === "ACCEPT") {
          console.log('ACCEPT');

          data = await Request.findById(requestId).populate({
            path: 'contractId',
            populate: {
              path: 'orderId',
            }
          });

          const reqRefund = {
            body: {
              vnp_TxnRef: data.contractId.orderId._id,
              transDate: data.contractId.orderId.vnp_PayDate,
              amount: data.contractId.orderId.vnp_Amount,
              transType: "02", //Hoàn toàn phần
              user: "Admin",
              contractId: data.contractId._id
            }
          }

          console.log(reqRefund)

          const res = await paymentService.refund(reqRefund)

          if (res.status == 400) return res;

          data = await Request.findByIdAndUpdate(requestId, reqBody, {
            runValidators: true,
            new: true,
          }).populate({
            path: 'contractId',
            populate: {
              path: 'orderId',
            }
          });

          const contractData = await Contract.findById(data.contractId._id);

          if (contractData) {
            contractData.status = "CANCEL";

            await contractData.save();
          }
        } else {
          data = await Request.findByIdAndUpdate(requestId, reqBody, {
            runValidators: true,
            new: true,
          }).populate({
            path: 'contractId',
            populate: {
              path: 'orderId',
            }
          });
        }
      } catch (error) {
        return {
          status: 400,
          data: {},
          messageError: error.message,
        };
      }

      return {
        status: 200,
        message: data !== null ? "OK" : "No data",
      };
    } catch (error) {
      console.error("error ne", error);
      return {
        status: 500,
        messageError: error.toString(),
      };
    } finally {
      // Close the database connection
      mongoose.connection.close();
    }
  },

  deleteRequest: async (requestId) => {
    try {
      let data = {};

      const url = process.env.URL_DB;
      await mongoose.connect(url, {
        family: 4,
        dbName: "interiorConstruction",
      });

      try {
        data = await Request.findOneAndDelete({
          _id: new ObjectId(requestId),
        });
      } catch (error) {
        return {
          status: 400,
          data: {},
          messageError: error.message,
        };
      }

      return {
        status: 200,
        data: data !== null ? data : {},
        message: data !== null ? "OK" : "No data",
      };
    } catch (error) {
      console.error("error ne", error);
      return {
        status: 500,
        messageError: error.toString(),
      };
    } finally {
      // Close the database connection
      mongoose.connection.close();
    }
  },
};
