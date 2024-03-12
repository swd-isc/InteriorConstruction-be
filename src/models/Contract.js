import mongoose from "mongoose";
const Schema = mongoose.Schema;

const contractSchema = new Schema(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      required: [true, "Client ID required."],
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
      ref: "client",
    },
    furnitures: [
      {
        furnitureId: {
          type: Schema.Types.ObjectId,
          required: [true, "furnitureId required."],
          ref: "furniture",
        },
        quantity: {
          type: Number,
          required: [true, "quantity for furniture required."],
        },
        name: {
          type: String,
          required: [true, "Name required."],
        },
      },
    ],
    designs: [
      {
        designId: {
          type: Schema.Types.ObjectId,
          required: [true, "designId required."],
          ref: "design",
        },
        quantity: {
          type: Number,
          required: [true, "quantity for design required."],
        },
        designName: {
          type: String,
          required: [true, "Design name required."],
        },
        furnitures: [
          {
            furnitureId: {
              type: Schema.Types.ObjectId,
              required: [true, "furnitureId required."],
              ref: "furniture",
            },
            name: {
              type: String,
              required: [true, "Name required."],
            },
          },
        ],
      },
    ],
    contractPrice: {
      type: Number,
      min: [0, "Must be a positive number."],
      required: [true, "Contract price required."],
    },
    status: {
      type: String,
      enum: {
        values: ["CANCEL", "PROCESSING", "SUCCESS"],
        message: "{VALUE} is not supported.",
      },
      required: [true, "Status required."],
    },
  },
  {
    collection: "contract",
    versionKey: false,
  }
);

let Contract = mongoose.model("contract", contractSchema);

module.exports = Contract;
