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
                    throw new mongoose.Error(`Design card ID required.`); // Value is required
                }

                const designCard = await DesignCard.findById(value);
                if (!designCard) {
                    throw new mongoose.Error(`${value} is not a valid design card ID.`); // Invalid ObjectId reference in the array
                }
                return true; // Return true if designCard exists, otherwise false
            },
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
    furnitures: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'furniture', // Reference to the Furniture schema
        }],
        validate: {
            validator: async function (value) {
                const Furniture = mongoose.model('furniture');

                if (!Array.isArray(value)) {
                    throw new mongoose.Error(`Furnitures must be an array.`);
                }

                if (value.length == 0) { //empty array
                    throw new mongoose.Error(`Empty furnitures array`);
                }

                // Get the classifications of the design
                const designClassifications = this.classifications;

                for (const furnitureId of value) {
                    const furniture = await Furniture.findById(furnitureId);

                    if (!furniture) {
                        throw new mongoose.Error(`Invalid furnitureId: ${furnitureId}`); // Invalid ObjectId reference in the array
                    }

                    // Check conditions based on the type of Design
                    if (this.type === 'DEFAULT' && furniture.type !== 'DEFAULT') {
                        throw new mongoose.Error(`FurnitureId ${furnitureId} type must be 'DEFAULT'`); // Furniture type must be 'DEFAULT' for 'DEFAULT' Design
                    }

                    // Get the classifications of the furniture
                    const furnitureClassifications = furniture.classifications;

                    let hasCommon = designClassifications.some(item => furnitureClassifications.includes(item));
                    if (!hasCommon) {
                        throw new mongoose.Error(`Don't have common classifications`);
                    }
                }

                // Check for duplicate furniture ObjectId in the array
                for (let i = 0; i < value.length - 1; i++) {
                    for (let j = i + 1; j < value.length; j++) {
                        if (value[i].toString() === value[j].toString()) {
                            throw new mongoose.Error(`Duplicate furnitureId: ${value[i].toString()}`);
                        }
                    }
                }
                return true;
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
                let foundRoomClassification = false;

                for (const classificationId of value) {
                    const classification = await Classification.findById(classificationId);
                    if (!classification) {
                        throw new mongoose.Error(`Invalid classificationId: ${classificationId}`); // Invalid ObjectId reference in the array
                    }
                    if (classification.type != 'ROOM' && classification.type != 'STYLE') {
                        throw new mongoose.Error(`Invalid 'type' field of classificationId: ${classificationId}`); // Invalid 'type' references in the classification array
                    }

                    // Check if the classification type is 'ROOM'
                    if (classification.type === 'ROOM') {
                        foundRoomClassification = true;
                    }

                    // Check if the classification type is 'STYLE'
                    if (classification.type === 'STYLE') {
                        foundStyleClassification = true;
                    }
                }

                // Check if at least one 'ROOM' classification is found
                if (!foundRoomClassification) {
                    throw new mongoose.Error(`At least one classification must have the type "ROOM"`);
                }

                // Check if at least one 'STYLE' classification is found
                if (!foundStyleClassification) {
                    throw new mongoose.Error(`At least one classification must have the type "STYLE"`);
                }

                // Check for duplicate material ObjectId in the array
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
    collection: 'design',
    versionKey: false
});

let Design = mongoose.model('design', designSchema);

module.exports = Design;
