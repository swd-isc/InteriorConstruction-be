import mongoose from "mongoose";
import Order from "../models/Order";
import Client from "../models/Client";
import Contract from "../models/Contract";

const ObjectId = mongoose.Types.ObjectId;

export const orderRepository = {
  getOrders: async () => {
    try {
      const url = process.env.URL_DB;
      await mongoose.connect(url, {
        family: 4,
        dbName: "interiorConstruction",
      });

      const data = await Order.find()
        .populate({
          path: 'clientId',
          select: '-contracts',
          populate: {
            path: 'accountId',
            select: '-password -refreshToken',
          }
        })
        .populate({
          path: "contractId",
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

  getOrderById: async (id) => {
    try {
      const url = process.env.URL_DB;
      await mongoose.connect(url, {
        family: 4,
        dbName: "interiorConstruction",
      });

      const data = await Order.findById(id)
        .populate({
          path: 'clientId',
          select: '-contracts',
          populate: {
            path: 'accountId',
            select: '-password -refreshToken',
          }
        })
        .populate({
          path: "contractId",
        });

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

  createOrder: async (reqBody) => {
    try {
      let data = [];
      const url = process.env.URL_DB;
      await mongoose.connect(url, {
        family: 4,
        dbName: "interiorConstruction",
      });
      const order = new Order(reqBody);

      try {
        data = await order.save();
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

  updateOrder: async (orderId, reqBody) => {
    try {
      let data = {};

      const url = process.env.URL_DB;
      await mongoose.connect(url, {
        family: 4,
        dbName: "interiorConstruction",
      });

      try {
        data = await Order.findByIdAndUpdate(orderId, reqBody, {
          runValidators: true,
          new: true,
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

  deleteOrder: async (orderId) => {
    try {
      let data = {};

      const url = process.env.URL_DB;
      await mongoose.connect(url, {
        family: 4,
        dbName: "interiorConstruction",
      });

      try {
        data = await Order.findOneAndDelete({
          _id: new ObjectId(orderId),
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
