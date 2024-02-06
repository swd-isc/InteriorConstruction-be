import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const colorSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name required.'],
        unique: [true, 'Name must be unique.'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description required.'],
        trim: true
    }
});

let Color = mongoose.model('color', colorSchema);

module.exports = Color;
