import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const clientSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    birthDate: {
        type: Date,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    photoURL: {
        type: String,
        required: true,
    },
    accountId: {
        type: ObjectId,
        required: true,
    },
    contract: {
        type: Array,
        required: true,
    }
});

let Client = mongoose.model('client', clientSchema);

module.exports = Client;
