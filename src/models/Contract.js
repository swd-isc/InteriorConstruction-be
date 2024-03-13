import mongoose from "mongoose";
const Schema = mongoose.Schema;

const contractSchema = new Schema(
  {
    client: {
      clientId: {
        type: Schema.Types.ObjectId,
        required: [true, "Client ID required."],
        ref: "client",
      },
      firstName: {
        type: String,
        required: [true, "First name required."],
        trim: true,
      },
      lastName: {
        type: String,
        required: [true, "Last name required."],
        trim: true,
      },
      required: [true, "Client required."],
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
    date: {
      type: String,
      required: [true, "Date required"],
    },
  },
  {
    collection: "contract",
    versionKey: false,
  }
);

let Contract = mongoose.model("contract", contractSchema);

module.exports = Contract;
