import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export const classificationSchema = new Schema({
    classificationName: {
        type: String,
        required: [true, 'Classification name required.'],
        unique: true,
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
}, {
    collection: 'classification',
    versionKey: false
});

let Classification = mongoose.model('classification', classificationSchema);

module.exports = Classification;
