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
                    return false; // Value is required
                }

                const account = await Account.findById(value);
                if (!account) {
                    return false; // Invalid ObjectId reference in the array
                }
                return true; // Return true if account exists, otherwise false
            },
            message: props => `${props.value} is not a valid account ID.`
        },
        unique: true
    },
    contract: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'contract', // Reference to the Material schema
            unique: true
        }],
        validate: {
            validator: async function (value) {
                const Contract = mongoose.model('contract');

                if (!Array.isArray(value)) {
                    return false; // Not an array
                }

                for (const contractId of value) {
                    const contract = await Contract.findById(contractId);

                    if (!contract) {
                        return false; // Invalid ObjectId reference in the array
                    }

                    // Check if the clientId in the contract matches the _id of the client
                    if (contract.clientId.toString() !== this._id.toString()) {
                        return false; // ClientId in the contract doesn't match the _id of the client
                    }
                }

                // Check for duplicate contract ObjectId in the array
                // for (let i = 0; i < value.length - 1; i++) {
                //     for (let j = i + 1; j < value.length; j++) {
                //         if (value[i].toString() === value[j].toString()) {
                //             return false;
                //         }
                //     }
                // }
                return true;
            },
            message: "Invalid contracts array",
        },
        required: false,
    }
}, {
    collection: 'client',
    versionKey: false
});

let Client = mongoose.model('client', clientSchema);

module.exports = Client;
