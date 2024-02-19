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
    designId: {
        type: Schema.Types.ObjectId,
        required: [true, 'Design ID required.'],
        validate: {
            validator: async function (value) {
                const Design = mongoose.model('design');

                if (!value) {
                    throw new mongoose.Error(`Design ID required.`); // Value is required
                }

                const design = await Design.findById(value);
                if (!design) {
                    throw new mongoose.Error(`${value} is not a valid design ID.`); // Invalid ObjectId reference in the array
                }
                return true; // Return true if design exists, otherwise false
            }
        },
        ref: 'design'
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
