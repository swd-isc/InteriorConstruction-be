import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export const contractSchema = new Schema({
    clientId: {
        type: Schema.Types.ObjectId,
        required: [true, 'Client ID required.'],
        ref: 'client'
    },
    designId: {
        type: Schema.Types.ObjectId,
        required: [true, 'Design ID required.'],
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
