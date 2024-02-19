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
                    throw new mongoose.Error(`Return exchange cases must be an array.`); // Not an array
                }
                if (value.length == 0) {
                    throw new mongoose.Error(`Empty return exchange array`);
                }
                return true;
            }
        }
    },
    nonReturnExchangeCases: {
        type: [String],
        validate: {
            validator: async function (value) {
                if (!Array.isArray(value)) {
                    throw new mongoose.Error(`Non return exchange cases must be an array.`); // Not an array
                }
                if (value.length == 0) {
                    throw new mongoose.Error(`Empty non return exchange array`);
                }
                return true;
            },
        }
    },
    returnProcedure: {
        type: [String],
        validate: {
            validator: async function (value) {
                if (!Array.isArray(value)) {
                    throw new mongoose.Error(`Return procedure must be an array.`); // Not an array
                }
                if (value.length == 0) {
                    throw new mongoose.Error(`Empty non return procedure array`);
                }
                return true;
            }
        },
    },
}, {
    collection: 'return_policy',
    versionKey: false
});

let ReturnPolicy = mongoose.model('return_policy', returnPolicySchema);

module.exports = ReturnPolicy;
