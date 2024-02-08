import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const materialSchema = new Schema({
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
    collection: 'material',
    versionKey: false
});

let Material = mongoose.model('material', materialSchema);

module.exports = Material;
