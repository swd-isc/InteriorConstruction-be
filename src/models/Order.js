import mongoose from "mongoose";
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    vnp_Amount: {
      type: Number,
      required: [true, "Amount required."],
    },
    vnp_BankCode: {
      type: String,
      required: [true, "Bank code required."],
    },
    vnp_BankTranNo: {
      type: String,
      required: [true, "Bank transaction number required."],
    },
    vnp_CardType: {
      type: String,
      required: [true, "Card type required."],
    },
    vnp_PayDate: {
      type: String,
      required: [true, "Pay date required."],
    },
    vnp_OrderInfo: {
      type: String,
      required: [true, "Order information required."],
    },
    vnp_TransactionNo: {
      type: String,
      required: [true, "Transaction number required."],
    },
    vnp_TransactionStatus: {
      type: String,
      required: [true, "Transaction status required."],
    },
    vnp_TxnRef: {
      type: String,
      required: [true, "TxnRef required."],
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

let Order = mongoose.model("order", orderSchema);

module.exports = Order;
