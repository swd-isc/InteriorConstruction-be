import mongoose from 'mongoose';
import Material from './Material';
import Color from './Color';
import Classification from './Classification';
const Schema = mongoose.Schema;

const furnitureSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name required.'],
    },
    imgURL: {
        type: String,
        required: false,
    },
    materials: {
        type: [Material],
        required: [true, 'Materials required.'],
    },
    colors: {
        type: [Color],
        required: [true, 'Colors required.'],
    },
    sizes: {
        type: String, //Example: D980 - R700 - C400/ D980 - R1880 - C400 mm
        required: [true, 'Sizes required.'],
    },
    price: {
        type: Number,
        min: [0, 'Must be a positive number.'],
        required: [true, 'Price required.'],
    },
    type: {
        type: String,
        enum: {
            values: ['DEFAULT', 'CUSTOM'],
            message: '{VALUE} is not supported.'
        },
        required: [true, 'Type required.'],
    },
    classifications: {
        type: [Classification],
        required: [true, 'Classification required.'],
    }
});

let Furniture = mongoose.model('furniture', furnitureSchema);

module.exports = Furniture;
