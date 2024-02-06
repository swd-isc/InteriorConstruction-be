import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export const materialSchema = new Schema({
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
}, {
    collection: 'material',
    versionKey: false
});

let Material = mongoose.model('material', materialSchema);

module.exports = Material;
