import mongoose from "mongoose";
const Schema = mongoose.Schema;

const requestSchema = new Schema(
  {
    status: {
      type: String,
      enum: {
        values: ["DEFAULT", "ACCEPT","DENY"],
        message: "{VALUE} is not supported.",
      },
      default: "DEFAULT",
      required: [true, "status required."],
    },
    refundAmount: {
      type: Number,
      required: [true, "status required."],
    },
    date: {
        type: String,
        required: [true, "status required."],
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
    collection: "request",
    versionKey: false,
  }
);

let Request = mongoose.model("request", requestSchema);

module.exports = Request;
