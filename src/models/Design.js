import mongoose from 'mongoose';
import Furniture from './Furniture'
import Classification from './Classification'
const Schema = mongoose.Schema;

const designSchema = new Schema({
    designName: {
        type: String,
        required: [true, 'Design name required.'],
    },
    description: {
        type: String,
        required: [true, 'Description required.'],
    },
    designURL: {
        type: String,
        required: [true, 'Design URL required.'],
    },
    designPrice: {
        type: Number,
        min: [0, 'Must be a positive number.'],
        required: [true, 'Design price required.'],
    },
    type: {
        type: String,
        enum: {
            values: ['DEFAULT', 'CUSTOM'],
            message: '{VALUE} is not supported.'
        },
        required: [true, 'Type required.'],
    },
    furnitures: {
        type: [Furniture],
        required: [true, 'Furnitures required.'],
    },
    classifications: {
        type: [Classification],
        required: [true, 'Classifications required.'],
    }
});

let Design = mongoose.model('design', designSchema);

module.exports = Design;
