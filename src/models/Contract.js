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
          unique: true,
        },
        description: {
          type: String,
          required: [true, "Description required."],
        },
        imgURL: {
          type: [String],
        },
        materials: {
          type: [
            {
              type: Schema.Types.ObjectId,
              ref: "material", // Reference to the Material schema
            },
          ],
        },
        colors: {
          type: [
            {
              type: Schema.Types.ObjectId,
              ref: "color", // Reference to the Color schema
            },
          ],
        },
        sizes: {
          type: String, //Example: D980 - R700 - C400/ D980 - R1880 - C400 mm
          required: [true, "Sizes required."],
        },
        price: {
          type: Number,
          min: [0, "Must be a positive number."],
          required: [true, "Price required."],
        },
        returnExchangeCases: {
          type: [String],
        },
        nonReturnExchangeCases: {
          type: [String],
        },
        delivery: {
          type: Schema.Types.ObjectId,
          required: [true, "Delivery ID required."],
          ref: "delivery",
        },
        type: {
          type: String,
          enum: {
            values: ["DEFAULT", "CUSTOM"],
            message: "{VALUE} is not supported.",
          },
          required: [true, "Type required."],
        },
        customBy: {
          type: Schema.Types.ObjectId,
          ref: "client",
        },
        classifications: {
          type: [
            {
              type: Schema.Types.ObjectId,
              ref: "classification", // Reference to the Classification schema
            },
          ],
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
          unique: true,
        },
        description: {
          type: String,
          required: [true, "Description required."],
        },
        designURL: {
          type: String,
          required: [true, "Design URL required."],
        },
        designCard: {
          type: Schema.Types.ObjectId,
          required: [true, "Design card required."],
          ref: "design_card",
        },
        designPrice: {
          type: Number,
          min: [0, "Must be a positive number."],
          required: [true, "Design price required."],
        },
        type: {
          type: String,
          enum: {
            values: ["DEFAULT", "CUSTOM"],
            message: "{VALUE} is not supported.",
          },
          required: [true, "Type required."],
        },
        customBy: {
          type: Schema.Types.ObjectId,
          ref: "client",
        },
        furnitures: {
          type: [
            {
              type: Schema.Types.ObjectId,
              ref: "furniture", // Reference to the Furniture schema
            },
          ],
        },
        classifications: {
          type: [
            {
              type: Schema.Types.ObjectId,
              ref: "classification", // Reference to the Classification schema
            },
          ],
        },
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
