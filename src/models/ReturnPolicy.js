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
            message: "Return exchange cases required array.",
        }
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
            message: "Non return exchange cases required array.",
        }
    },
    returnProcedure: {
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
            message: "Return procedure required array.",
        },
    },
}, {
    collection: 'return_policy',
    versionKey: false
});

let ReturnPolicy = mongoose.model('return_policy', returnPolicySchema);

module.exports = ReturnPolicy;
