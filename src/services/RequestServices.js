import mongoose from "mongoose";
import Request from "../models/Request";
import Client from "../models/Client";
import Contract from "../models/Contract";
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

      const data = await Request.find().populate('clientId').populate('contractId');

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

      const data = await Request.find({"clientId": clientId}).populate('clientId').populate('contractId');

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
      const request = new Request(reqBody);

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
          console.log('vo day r');
          data = await Request.findByIdAndUpdate(requestId, reqBody, {
            runValidators: true,
            new: true,
          }).populate({
            path: 'contractId',
            populate: {
              path: 'orderId',
            }
          });

          console.log('check data', data);

          const reqRefund = {
            orderId: data.contractId.orderId._id,
            transDate: data.contractId.orderId.vnp_PayDate,
            amount: data.contractId.orderId.vnp_Amount,
            transType: "02", //Hoàn toàn phần
          }
          paymentService.refund()
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
