import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export const furnitureSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name required.'],
        unique: true
    },
    description: {
        type: String,
        required: [true, 'Description required.'],
    },
    imgURL: {
        type: [String],
    },
    materials: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'material', // Reference to the Material schema
            validate: {
                validator: async function (value) {
                    const Material = mongoose.model('material');

                    if (!value) {
                        throw new mongoose.Error(`Material required.`);
                    }

                    const material = await Material.findById(value);
                    if (!material) {
                        throw new mongoose.Error(`${value} is not a valid material ID.`);
                    }

                    return true; // All elements are valid ObjectId references
                }
            },
        }],
        validate: {
            validator: async function (value) {
                if (value.length == 0) { //empty array
                    throw new mongoose.Error(`Empty materials array`);
                }
                // Check for duplicate material ObjectId in the array
                for (let i = 0; i < value.length - 1; i++) {
                    for (let j = i + 1; j < value.length; j++) {
                        if (value[i].toString() === value[j].toString()) {
                            throw new mongoose.Error(`Duplicate materialId: ${value[i].toString()}`);
                        }
                    }
                }
                return true;
            },
        },
    },
    colors: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'color', // Reference to the Color schema
            validate: {
                validator: async function (value) {
                    const Color = mongoose.model('color');
                    if (!value) {
                        throw new mongoose.Error(`Color required.`);
                    }
                    const color = await Color.findById(value);
                    if (!color) {
                        throw new mongoose.Error(`${value} is not a valid color ID.`);
                    }

                    return true; // All elements are valid ObjectId references
                },
            },
        }],
        validate: {
            validator: async function (value) {
                if (value.length == 0) { //empty array
                    throw new mongoose.Error(`Empty colors array`);
                }
                // Check for duplicate color ObjectId in the array
                for (let i = 0; i < value.length - 1; i++) {
                    for (let j = i + 1; j < value.length; j++) {
                        if (value[i].toString() === value[j].toString()) {
                            throw new mongoose.Error(`Duplicate colorId: ${value[i].toString()}`);
                        }
                    }
                }
            },
        },
    },
    sizes: {
        type: String, //Example: D980 - R700 - C400/ D980 - R1880 - C400 mm
        required: [true, 'Sizes required.'],
    },
    price: {
        type: Number,
        min: [0, 'Must be a positive number.'],
        required: [true, 'Price required.'],
    },
    returnExchangeCases: {
        type: [String],
        validate: {
            validator: async function (value) {
                if (!Array.isArray(value)) {
                    return false; // Not an array
                } else {
                    if (value.length == 0) {
                        return false;
                    }
                }
                return true;
            },
            message: "Return exchange cases cannot be empty.",
        },
    },
    nonReturnExchangeCases: {
        type: [String],
        validate: {
            validator: async function (value) {
                if (!Array.isArray(value)) {
                    return false; // Not an array
                } else {
                    if (value.length == 0) {
                        return false;
                    }
                }
                return true;
            },
            message: "Non return exchange cases cannot be empty.",
        },
    },
    delivery: {
        type: Schema.Types.ObjectId,
        required: [true, 'Delivery ID required.'],
        ref: 'delivery',
        validate: {
            validator: async function (value) {
                const Delivery = mongoose.model('delivery');

                if (!value) {
                    throw new mongoose.Error(`Delivery ID required.`); // Value is required
                }

                const delivery = await Delivery.findById(value);
                if (!delivery) {
                    throw new mongoose.Error(`${value} is not a valid delivery ID.`); // Invalid ObjectId reference in the array
                }
                return true; // Return true if delivery exists, otherwise false
            }
        }
    },
    type: {
        type: String,
        enum: {
            values: ['DEFAULT', 'CUSTOM'],
            message: '{VALUE} is not supported.'
        },
        validate: {
            validator: async function (value) {
                if (!this.customBy && value === "CUSTOM") {
                    throw new mongoose.Error(`Type ${value} required client ID.`); // Custom furnitures required clientId
                }
                if (this.customBy && value === "DEFAULT") {
                    throw new mongoose.Error(`Type ${value} do not have client ID.`); // Default furnitures do not have clientId
                }
                return true; // Return true if delivery exists, otherwise false
            }
        },
        required: [true, 'Type required.'],
    },
    customBy: {
        type: Schema.Types.ObjectId,
        ref: 'client',
        validate: {
            validator: async function (value) {
                const Client = mongoose.model('client');

                const delivery = await Client.findById(value);
                if (!delivery) {
                    throw new mongoose.Error(`${value} is not a valid client ID.`); // Invalid ObjectId reference in the array
                }
                return true; // Return true if delivery exists, otherwise false
            }
        }
    },
    classifications: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'classification', // Reference to the Classification schema
        }],
        validate: {
            validator: async function (value) {
                // Custom validator function to check if all elements in the array are valid ObjectId references
                const Classification = mongoose.model('classification');

                if (!Array.isArray(value)) {
                    throw new mongoose.Error(`Classifications must be an array.`);
                }

                if (value.length == 0) { //empty array
                    throw new mongoose.Error(`Empty classifications array`);
                }

                // Flag to track if at least one 'STYLE' classification is found
                let foundStyleClassification = false;
                let foundProductClassification = false;

                for (const classificationId of value) {
                    const classification = await Classification.findById(classificationId);
                    if (!classification) {
                        throw new mongoose.Error(`Invalid classificationId: ${classificationId}`); // Invalid ObjectId reference in the array
                    }
                    if (classification.type != 'PRODUCT' && classification.type != 'STYLE') {
                        throw new mongoose.Error(`Invalid 'type' field of classificationId: ${classificationId}`); // Invalid 'type' references in the classification array
                    }

                    // Check if the classification type is 'PRODUCT'
                    if (classification.type === 'PRODUCT') {
                        foundProductClassification = true;
                    }

                    // Check if the classification type is 'STYLE'
                    if (classification.type === 'STYLE') {
                        foundStyleClassification = true;
                    }
                }

                // Check if at least one 'PRODUCT' classification is found
                if (!foundProductClassification) {
                    throw new mongoose.Error(`At least one classification must have the type "PRODUCT"`);
                }

                // Check if at least one 'STYLE' classification is found
                if (!foundStyleClassification) {
                    throw new mongoose.Error(`At least one classification must have the type "STYLE"`);
                }

                // Check for duplicate classification ObjectId in the array
                for (let i = 0; i < value.length - 1; i++) {
                    for (let j = i + 1; j < value.length; j++) {
                        if (value[i].toString() === value[j].toString()) {
                            throw new mongoose.Error(`Duplicate classificationId: ${value[i].toString()}`);
                        }
                    }
                }
                return true;
            }
        }
    }
}, {
    collection: 'furniture',
    versionKey: false
});

// Index for type: "DEFAULT"
furnitureSchema.index({ type: 1 });

// Define an index on the classifications field
furnitureSchema.index({ classifications: 1 });

// Define an index on the createdAt field
furnitureSchema.index({ price: 1 });

let Furniture = mongoose.model('furniture', furnitureSchema);

module.exports = Furniture;
