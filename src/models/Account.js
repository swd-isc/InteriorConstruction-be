import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const accountSchema = new Schema({
    email: {
        type: String,
        validate: {
            validator: function (value) {
                return /^[\w-\.]+@gmail\.com$/.test(value);
            },
            message: props => `${props.value} is not a valid email.`
        },
        required: [true, 'Email required.'],
        unique: [true, 'Email must be unique.'],
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password required.'],
        minLength: [8, 'Password length at least 8 characters.'],
        trim: true
    },
    role: {
        type: String,
        enum: {
            values: ['CLIENT', 'ADMIN'],
            message: '{VALUE} is not supported.'
        },
        required: true,
    },
    logInMethod: {
        type: String,
        enum: {
            values: ['DEFAULT', 'GOOGLE'],
            message: '{VALUE} is not supported.'
        },
        required: true,
    }
});

let Account = mongoose.model('account', accountSchema);

module.exports = Account;
