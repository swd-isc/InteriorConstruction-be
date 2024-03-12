import mongoose from "mongoose";
const Schema = mongoose.Schema;

const refundSchema = new Schema(
  {
    vnp_TxnRef: {
      type: String,
      required: [true, "TxnRef is require."],
    },
    vnp_Amount: {
      type: Number,
      required: [true, "Amount is require"],
    },
    vnp_OrderInfo: {
      type: String,
      required: [true, "OrderInfo is require"],
    },
    vnp_BankCode: {
      type: String,
      required: [true, "BankCode is require"],
    },
    vnp_PayDate: {
      type: String,
      required: [true, "PayDate is require"],
    },
    vnp_TransactionNo: {
      type: String,
      required: [true, "TransactionNo is require"],
    },
    vnp_TransactionType: {
      type: String,
      required: [true, "TransactionType is require"],
    },
    vnp_TransactionStatus: {
      type: String,
      required: [true, "TransactionStatus is require"],
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
    collection: "refund",
    versionKey: false,
  }
);

let Refund = mongoose.model("refund", refundSchema);

module.exports = Refund;
