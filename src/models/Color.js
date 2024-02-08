import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const colorSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name required.'],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description required.'],
        trim: true
    }
}, {
    collection: 'color',
    versionKey: false
});

let Color = mongoose.model('color', colorSchema);

module.exports = Color;
