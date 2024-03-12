import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const contractSchema = new Schema({
    clientId: {
        type: Schema.Types.ObjectId,
        required: [true, 'Client ID required.'],
        validate: {
            validator: async function (value) {
                const Client = mongoose.model('client');

                if (!value) {
                    return false; // Value is required
                }

                const client = await Client.findById(value);
                if (!client) {
                    return false; // Invalid ObjectId reference in the array
                }
                return true; // Return true if client exists, otherwise false
            },
            message: props => `${props.value} is not a valid client ID.`
        },
        ref: 'client'
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
                
                for (const furnitureId of value) {
                    const furniture = await Furniture.findById(furnitureId);

                    if (!furniture) {
                        throw new mongoose.Error(`Invalid furnitureId: ${furnitureId}`); // Invalid ObjectId reference in the array
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
    contractPrice: {
        type: Number,
        min: [0, 'Must be a positive number.'],
        required: [true, 'Contract price required.'],
    },
    contractFileURL: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        enum: {
            values: ['CANCEL', 'PROCESSING', 'SUCCESS'],
            message: '{VALUE} is not supported.'
        },
        required: [true, 'Status required.'],
    }
}, {
    collection: 'contract',
    versionKey: false
});

let Contract = mongoose.model('contract', contractSchema);

module.exports = Contract;
