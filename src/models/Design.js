import mongoose from 'mongoose';
import { furnitureSchema } from './Furniture'
import { classificationSchema } from './Classification'
const Schema = mongoose.Schema;

const designSchema = new Schema({
    designName: {
        type: String,
        required: [true, 'Design name required.'],
    },
    description: {
        type: String,
        required: [true, 'Description required.'],
    },
    designURL: {
        type: String,
        required: [true, 'Design URL required.'],
    },
    designPrice: {
        type: Number,
        min: [0, 'Must be a positive number.'],
        required: [true, 'Design price required.'],
    },
    type: {
        type: String,
        enum: {
            values: ['DEFAULT', 'CUSTOM'],
            message: '{VALUE} is not supported.'
        },
        required: [true, 'Type required.'],
    },
    furnitures: {
        type: [furnitureSchema],
        validate: {
            validator: async function (value) {
                const Furniture = mongoose.model('furniture');

                if (!Array.isArray(value)) {
                    return false; // Not an array
                }

                for (const furnitureId of value) {
                    const furniture = await Furniture.findById(furnitureId);

                    if (!furniture) {
                        return false; // Invalid ObjectId reference in the array
                    }

                    // Check conditions based on the type of Design
                    if (this.type === 'DEFAULT' && furniture.type !== 'DEFAULT') {
                        return false; // Furniture type must be 'DEFAULT' for 'DEFAULT' Design
                    }
                }

                return true; // All elements are valid ObjectId references
            },
            message: "Invalid 'type' references in the furnitures array",
        },
        required: [true, 'Furnitures required.'],
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
                    if (classification.type != 'ROOM' && classification.type != 'STYLE') {
                        return false; // Invalid 'type' references in the classification array
                    }
                }

                return true; // All elements are valid ObjectId references
            },
            message: "Invalid 'type' references in the classification array",
        },
        required: [true, 'Classifications required.'],
    }
}, {
    collection: 'design',
    versionKey: false
});

let Design = mongoose.model('design', designSchema);

module.exports = Design;
