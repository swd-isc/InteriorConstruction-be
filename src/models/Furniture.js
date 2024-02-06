import mongoose from 'mongoose';
import { materialSchema } from './Material';
import { colorSchema } from './Color';
import { classificationSchema } from './Classification';
const Schema = mongoose.Schema;

export const furnitureSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name required.'],
    },
    imgURL: {
        type: String,
        required: false,
    },
    materials: {
        type: [materialSchema],
        required: [true, 'Materials required.'],
    },
    colors: {
        type: [colorSchema],
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
    type: {
        type: String,
        enum: {
            values: ['DEFAULT', 'CUSTOM'],
            message: '{VALUE} is not supported.'
        },
        required: [true, 'Type required.'],
    },
    classifications: {
        type: [classificationSchema],
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
                    console.log('check classification: ', classification);
                    if (classification.type != 'PRODUCT' && classification.type != 'STYLE') {
                        return false; // Invalid 'type' references in the classification array
                    }
                }

                return true; // All elements are valid ObjectId references
            },
            message: "Invalid 'type' references in the classification array",
        },
        required: [true, 'Classification required.'],
    }
}, {
    collection: 'furniture',
    versionKey: false
});

let Furniture = mongoose.model('furniture', furnitureSchema);

module.exports = Furniture;
