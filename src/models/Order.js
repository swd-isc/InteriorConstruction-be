import mongoose from "mongoose";
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    orderId: {
      type: String,
      required: [true, "orderInfo required."],
    },
    payDate: {
      type: String,
      required: [true, "payDate required."],
    },
    clientId: {
      type: Schema.Types.ObjectId,
      required: [true, "client ID required."],
      ref: "client",
      validate: {
        validator: async function (value) {
          const Client = mongoose.model("client");

          if (!value) {
            return false; // Value is required
          }

          const client = await Client.findById(value);
          if (!client) {
            return false; // Invalid ObjectId reference in the array
          }
          return true; // Return true if client exists, otherwise false
        },
        message: (props) => `${props.value} is not a valid client ID.`,
      },
    },
    contractId: {
      type: Schema.Types.ObjectId,
      required: [true, "contract ID required."],
      ref: "contract",
      validate: {
        validator: async function (value) {
          const Contract = mongoose.model("contract");

          if (!value) {
            return false; // Value is required
          }

          const contract = await Contract.findById(value);
          if (!contract) {
            return false; // Invalid ObjectId reference in the array
          }
          return true; // Return true if contract exists, otherwise false
        },
        message: (props) => `${props.value} is not a valid contract ID.`,
      },
    },
  },
  {
    collection: "order",
    versionKey: false,
  }
);

let Color = mongoose.model("order", orderSchema);

module.exports = Color;
