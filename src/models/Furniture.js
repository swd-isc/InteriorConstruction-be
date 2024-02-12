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
                        return false; // Value is required
                    }

                    const material = await Material.findById(value);
                    if (!material) {
                        return false; // Invalid ObjectId reference in the array
                    }

                    return true; // All elements are valid ObjectId references
                },
                message: props => `${props.value} is not a valid material ID.`
            },
        }],
        validate: {
            validator: async function (value) {
                // Check for duplicate material ObjectId in the array
                for (let i = 0; i < value.length - 1; i++) {
                    for (let j = i + 1; j < value.length; j++) {
                        if (value[i].toString() === value[j].toString()) {
                            return false;
                        }
                    }
                }
                return true;
            },
            message: 'Duplicate material ID in array'
        },
        required: [true, 'Materials required.'],
    },
    colors: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'color', // Reference to the Color schema
            validate: {
                validator: async function (value) {
                    const Color = mongoose.model('color');

                    if (!value) {
                        return false; // Value is required
                    }

                    const color = await Color.findById(value);
                    if (!color) {
                        return false; // Invalid ObjectId reference in the array
                    }

                    return true; // All elements are valid ObjectId references
                },
                message: props => `${props.value} is not a valid color ID.`
            },
        }],
        validate: {
            validator: async function (value) {
                // Check for duplicate color ObjectId in the array
                for (let i = 0; i < value.length - 1; i++) {
                    for (let j = i + 1; j < value.length; j++) {
                        if (value[i].toString() === value[j].toString()) {
                            return false;
                        }
                    }
                }
                return true;
            },
            message: 'Duplicate color ID in array'
        },
        required: [true, 'Colors required.'],
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
        required: [true, 'Delivery required.'],
        ref: 'delivery',
        validate: {
            validator: async function (value) {
                const Delivery = mongoose.model('delivery');

                if (!value) {
                    return false; // Value is required
                }

                const delivery = await Delivery.findById(value);
                if (!delivery) {
                    return false; // Invalid ObjectId reference in the array
                }
                return true; // Return true if delivery exists, otherwise false
            },
            message: props => `${props.value} is not a valid delivery ID.`
        }
    },
    type: {
        type: String,
        enum: {
            values: ['DEFAULT', 'CUSTOM'],
            message: '{VALUE} is not supported.'
        },
        required: [true, 'Type required.'],
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
                    return false; // Not an array
                }

                for (const classificationId of value) {
                    const classification = await Classification.findById(classificationId);
                    if (!classification) {
                        return false; // Invalid ObjectId reference in the array
                    }
                    if (classification.type != 'PRODUCT' && classification.type != 'STYLE') {
                        console.log('check classification err: ', classification);
                        return false; // Invalid 'type' references in the classification array
                    }
                }

                // Check for duplicate classification ObjectId in the array
                for (let i = 0; i < value.length - 1; i++) {
                    for (let j = i + 1; j < value.length; j++) {
                        if (value[i].toString() === value[j].toString()) {
                            return false;
                        }
                    }
                }
                return true;
            },
            message: "Invalid classification array",
        },
        required: [true, 'Classification required.'],
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
