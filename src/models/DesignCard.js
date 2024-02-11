import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const designCardSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title required.'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description required.'],
    },
    imgURL: {
        type: String,
        required: [true, 'Image URL required.'],
    },
}, {
    collection: 'design_card',
    versionKey: false
});

let DesignCard = mongoose.model('design_card', designCardSchema);

module.exports = DesignCard;
