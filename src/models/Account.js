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
    },
    password: {
        type: String,
        required: [true, 'Password required.'],
        minLength: [8, 'Password length at least 8 characters.'],
    },
    role: {
        type: String,
        enum: {
            values: ['CLIENT', 'ADMIN'],
            message: '{VALUE} is not supported.'
        },
        required: [true, 'Role required.'],
    },
    logInMethod: {
        type: String,
        enum: {
            values: ['DEFAULT', 'GOOGLE'],
            message: '{VALUE} is not supported.'
        },
        required: [true, 'Login method required.'],
    }
});

let Account = mongoose.model('account', accountSchema);

module.exports = Account;
