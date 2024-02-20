import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const clientSchema = new Schema({
    firstName: {
        type: String,
        required: [true, 'First name required.'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Last name required.'],
        trim: true
    },
    birthDate: {
        type: Date,
        max: [
            new Date('2006-01-01'),
            ({ value }) => `${value} is not allowed. Client must be older than 18.`,
        ],
        required: [true, 'Birth date required.'],
    },
    phone: {
        type: String,
        validate: {
            validator: function (value) {
                return /((^(\+84|84|0){1})(3|5|7|8|9))+([0-9]{8})$/.test(value);
            },
            message: props => `${props.value} is not a valid VN phone number.`
        },
        required: [true, 'Phone required.'],
        unique: true
    },
    photoURL: {
        type: String,
        required: false,
    },
    accountId: {
        type: Schema.Types.ObjectId,
        required: [true, 'Account ID required.'],
        ref: 'account',
        validate: {
            validator: async function (value) {
                const Account = mongoose.model('account');

                if (!value) {
                    throw new mongoose.Error(`Account ID required.`); // Value is required
                }

                const account = await Account.findById(value);
                if (!account) {
                    throw new mongoose.Error(`${value} is not a valid account ID.`); // Invalid ObjectId reference in the array
                }
                return true; // Return true if account exists, otherwise false
            },
            message: props => `${props.value} is not a valid account ID.`
        },
        unique: true
    },
    contracts: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'contract', // Reference to the Material schema
        }],
        validate: {
            validator: async function (value) {
                const Contract = mongoose.model('contract');

                if (!Array.isArray(value)) {
                    throw new mongoose.Error(`Contracts must be an array.`);
                }

                

                for (const contractId of value) {
                    const contract = await Contract.findById(contractId);

                    if (!contract) {
                        throw new mongoose.Error(`Invalid contractId: ${contractId}`); // Invalid ObjectId reference in the array
                    }

                    // Check if the clientId in the contract matches the _id of the client
                    if (contract.clientId.toString() !== this._id.toString()) {
                        throw new mongoose.Error(`ClientId in the contract ${contractId} doesn't match the clientId`); // ClientId in the contract doesn't match the _id of the client
                    }
                }

                // Check for duplicate contract ObjectId in the array
                for (let i = 0; i < value.length - 1; i++) {
                    for (let j = i + 1; j < value.length; j++) {
                        if (value[i].toString() === value[j].toString()) {
                            throw new mongoose.Error(`Duplicate contractId: ${value[i]} in the array`);
                        }
                    }
                }
                return true;
            },
        },
        required: false,
    }
}, {
    collection: 'client',
    versionKey: false
});

let Client = mongoose.model('client', clientSchema);

module.exports = Client;
