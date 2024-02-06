import mongoose from 'mongoose';
import Contract from './Contract'
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
    },
    photoURL: {
        type: String,
        required: false,
    },
    accountId: {
        type: Schema.Types.ObjectId,
        required: [true, 'Account ID required.'],
        ref: 'account'
    },
    contract: {
        type: [Contract],
        required: false,
    }
});

let Client = mongoose.model('client', clientSchema);

module.exports = Client;
