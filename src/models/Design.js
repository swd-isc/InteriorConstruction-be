import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const designSchema = new Schema({
    designName: {
        type: String,
        required: [true, 'Design name required.'],
        unique: true
    },
    description: {
        type: String,
        required: [true, 'Description required.'],
    },
    designURL: {
        type: String,
        required: [true, 'Design URL required.'],
    },
    designCard: {
        type: Schema.Types.ObjectId,
        required: [true, 'Design card required.'],
        ref: 'design_card',
        validate: {
            validator: async function (value) {
                const DesignCard = mongoose.model('design_card');

                if (!value) {
                    return false; // Value is required
                }

                const designCard = await DesignCard.findById(value);
                if (!designCard) {
                    return false; // Invalid ObjectId reference in the array
                }
                return true; // Return true if designCard exists, otherwise false
            },
            message: props => `${props.value} is not a valid design card ID.`
        }
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
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'furniture', // Reference to the Furniture schema
        }],
        validate: {
            validator: async function (value) {
                const Furniture = mongoose.model('furniture');

                if (!Array.isArray(value)) {
                    return false; // Not an array
                }

                // Get the classifications of the design
                const designClassifications = this.classifications;

                for (const furnitureId of value) {
                    const furniture = await Furniture.findById(furnitureId);

                    if (!furniture) {
                        return false; // Invalid ObjectId reference in the array
                    }

                    // Check conditions based on the type of Design
                    if (this.type === 'DEFAULT' && furniture.type !== 'DEFAULT') {
                        console.log('wrong type furniture: ', furniture._id);
                        return false; // Furniture type must be 'DEFAULT' for 'DEFAULT' Design
                    }

                    // Get the classifications of the furniture
                    const furnitureClassifications = furniture.classifications;

                    let hasCommon = designClassifications.some(item => furnitureClassifications.includes(item));
                    if (!hasCommon) {
                        console.log(`Don't have common classifications`);
                        return false;
                    }
                }

                // Check for duplicate furniture ObjectId in the array
                for (let i = 0; i < value.length - 1; i++) {
                    for (let j = i + 1; j < value.length; j++) {
                        if (value[i].toString() === value[j].toString()) {
                            return false;
                        }
                    }
                }
                return true;
            },
            message: "Invalid furnitures array",
        },
        required: [true, 'Furnitures required.'],
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
                    if (classification.type != 'ROOM' && classification.type != 'STYLE') {
                        console.log('wrong classification: ', classification);
                        return false; // Invalid 'type' references in the classification array
                    }
                }

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
            message: "Invalid classification array",
        },
        required: [true, 'Classifications required.'],
    }
}, {
    collection: 'design',
    versionKey: false
});

let Design = mongoose.model('design', designSchema);

module.exports = Design;
