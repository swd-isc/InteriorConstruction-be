import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const classificationSchema = new Schema({
    classificationName: {
        type: String,
        required: [true, 'Classification name required.'],
        unique: [true, 'Classification name must be unique.'],
        trim: true
    },
    type: {
        type: String,
        enum: {
            values: ['PRODUCT', 'ROOM', 'STYLE'],
            message: '{VALUE} is not supported.'
        },
        required: [true, 'Type required.'],
    }
});

let Classification = mongoose.model('classification', classificationSchema);

module.exports = Classification;
