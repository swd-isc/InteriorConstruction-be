import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const deliverySchema = new Schema({
    description: {
        type: String,
        required: [true, 'Description required.'],
        trim: true
    },
    noCharge: {
        type: String,
        required: [true, 'No charge required.'],
    },
    surcharge: {
        type: String,
        required: [true, 'Surcharge required.'],
    },
}, {
    collection: 'delivery',
    versionKey: false
});

let Delivery = mongoose.model('delivery', deliverySchema);

module.exports = Delivery;
