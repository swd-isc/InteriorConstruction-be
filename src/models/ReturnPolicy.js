import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const returnPolicySchema = new Schema({
    headerName: {
        type: String,
        required: [true, 'Header name required.'],
        trim: true
    },
    headerDescription: {
        type: String,
        required: [true, 'Header description required.'],
        trim: true
    },
    titleName: {
        type: String,
        required: [true, 'Title name required.'],
        trim: true
    },
    titleDescription: {
        type: String,
        required: [true, 'Title description required.'],
        trim: true
    },
    returnExchangeCases: {
        type: [String],
        required: [true, 'Return exchange cases cannot be empty.'],
    },
    nonReturnExchangeCases: {
        type: [String],
        required: [true, 'Non return exchange cases cannot be empty.'],
    },
    returnProcedure: {
        type: String,
        required: [true, 'Return procedure required.'],
    },
}, {
    collection: 'return_policy',
    versionKey: false
});

let ReturnPolicy = mongoose.model('return_policy', returnPolicySchema);

module.exports = ReturnPolicy;
