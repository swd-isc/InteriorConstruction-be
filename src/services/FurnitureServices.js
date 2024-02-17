import Furniture from '../models/Furniture';
import Color from '../models/Color';
import Material from '../models/Material';
import Classification from '../models/Classification';

import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

export const getFurnitureByPage = async (mode, pageReq) => {
    try {
        let sortAsc = sortByInput(mode);
        const itemsPerPage = 10;
        // Parse query parameters
        const page = parseInt(pageReq) || 1;
        let currentPageData = [];

        // Calculate start and end indices for the current page
        const startIndex = (page - 1) * itemsPerPage;

        // Get the data for the current page
        const url = process.env.URL_DB;
        await mongoose.connect(url, { family: 4, dbName: 'interiorConstruction' });

        currentPageData = await Furniture.aggregate([
            {
                $match: {
                    'type': 'DEFAULT',
                },
            },
            {
                $lookup: {
                    from: 'color', // Assuming your color schema collection is named 'color'
                    localField: 'colors',
                    foreignField: '_id',
                    as: 'colorsData',
                },
            },
            {
                $lookup: {
                    from: 'material', // Assuming your material schema collection is named 'material'
                    localField: 'materials',
                    foreignField: '_id',
                    as: 'materialsData',
                },
            },
            { // Separate the groups for colors, materials and furnitures
                $facet: {
                    colors: [
                        {
                            $unwind: '$colorsData', // Unwind the colors array
                        },
                        {
                            $group: {
                                _id: '$colorsData._id',
                                name: { $first: '$colorsData.name' },
                                count: { $sum: 1 },
                            },
                        },
                        {
                            $sort: {
                                // Specify the field you want to use for sorting, e.g., '_id'
                                'name': 1,
                            },
                        },
                    ],
                    materials: [
                        {
                            $unwind: '$materialsData', // Unwind the materials array
                        },
                        {
                            $group: {
                                _id: '$materialsData._id',
                                name: { $first: '$materialsData.name' },
                                count: { $sum: 1 },
                            },
                        },
                        {
                            $sort: {
                                // Specify the field you want to use for sorting, e.g., '_id'
                                'name': 1,
                            },
                        },
                    ],
                    furnitures: [
                        {
                            $group: {
                                _id: '$_id',
                                name: { $first: '$name' },
                                imgURL: { $first: '$imgURL' },
                                price: { $first: '$price' },
                            },
                        },
                        {
                            $sort: {
                                // Specify the field you want to use for sorting, e.g., '_id'
                                'price': sortAsc,
                            },
                        },
                    ],
                },
            },
            {
                $project: {
                    _id: 0,
                    furnitures: { $slice: ['$furnitures', startIndex, itemsPerPage] },
                    page: `${page}`,
                    totalPages: {
                        $ceil: {
                            $divide: [{ $size: "$furnitures" }, 10]
                        }
                    },
                    materials: 1,
                    colors: 1,
                },
            },
        ]);

        // currentPageData = await Furniture.find({}).sort({ price: sortAsc })
        //     .skip(startIndex).limit(itemsPerPage)
        //     .select('name imgURL price materials colors')
        //     .populate({
        //         path: "materials",
        //         select: 'name',
        //     })
        //     .populate({
        //         path: "colors",
        //         select: 'name',
        //     })
        return {
            status: 200,
            data: currentPageData,
            page: page,
            totalPages: totalPages,
            message: currentPageData.length !== 0 ? "OK" : "No data"
        };

    } catch (error) {
        console.error(error);
        return {
            status: 500,
            messageError: error,
        }
    } finally {
        // Close the database connection
        mongoose.connection.close();
    }
}

export const getFurnitureById = async (id) => {
    try {
        const idValid = await isIdValid(id, 'furniture');
        if (!idValid.isValid) {
            return {
                status: idValid.status,
                data: {},
                messageError: idValid.messageError
            }
        }

        const url = process.env.URL_DB;
        await mongoose.connect(url, { family: 4, dbName: 'interiorConstruction' });

        const data = await Furniture.findById(id)
            .populate({
                path: 'colors',
                select: '-_id name',
            })
            .populate({
                path: 'materials',
                select: '-_id name',
            })
            .populate({
                path: 'delivery',
                select: '-_id', // Exclude the _id field
            })
            .populate({
                path: 'classifications',
                select: '-_id classificationName',
            })
        if (data) {
            return {
                status: 200,
                data: data,
                message: "OK"
            };
        } else {
            return {
                status: 200,
                data: {},
                message: "No data"
            }
        }
    } catch (error) {
        return {
            status: 500,
            messageError: error,
        }
    } finally {
        // Close the database connection
        mongoose.connection.close();
    }
}

export const getFurnitureByClassificationId = async (id, pageReq, mode) => {
    try {
        let data = {};
        const idValid = await isIdValid(id, 'classification');

        if (!idValid.isValid) {
            return {
                status: idValid.status,
                data: data,
                messageError: idValid.messageError
            }
        }
        let sortAsc = sortByInput(mode);

        const itemsPerPage = 10;
        // Parse query parameters
        const page = parseInt(pageReq) || 1;

        // Calculate start and end indices for the current page
        const startIndex = (page - 1) * itemsPerPage;

        // Get the data for the current page
        const url = process.env.URL_DB;
        await mongoose.connect(url, { family: 4, dbName: 'interiorConstruction' });

        data = await Furniture.aggregate([
            {
                $match: {
                    'type': 'DEFAULT',
                },
            },
            {
                $lookup: {
                    from: 'color',
                    localField: 'colors',
                    foreignField: '_id',
                    as: 'colorsData',
                },
            },
            {
                $lookup: {
                    from: 'material',
                    localField: 'materials',
                    foreignField: '_id',
                    as: 'materialsData',
                },
            },
            {
                $lookup: {
                    from: 'classification',
                    localField: 'classifications',
                    foreignField: '_id',
                    as: 'classificationsData',
                },
            },
            {
                $unwind: '$classificationsData', // Unwind the classifications array
            },
            {
                $group: {
                    _id: '$classificationsData._id',
                    colors: { $push: '$colorsData' },
                    materials: { $push: '$materialsData' },
                    furnitures: {
                        $addToSet: {
                            _id: '$_id',
                            name: '$name',
                            imgURL: '$imgURL',
                            price: '$price',
                        },
                    },
                },
            },
            {
                $match: {
                    '_id': new ObjectId(id),
                },
            },
            { // Separate the groups for colors, materials and furnitures
                $facet: {
                    colors: [
                        {
                            $unwind: '$colors', // Unwind the colors array
                        },
                        {
                            $unwind: '$colors', // Unwind the colors array
                        },
                        {
                            $group: {
                                _id: '$colors._id',
                                name: { $first: '$colors.name' },
                                count: { $sum: 1 },
                            },
                        },
                        {
                            $sort: {
                                // Specify the field you want to use for sorting, e.g., '_id'
                                'name': 1,
                            },
                        },
                    ],
                    materials: [
                        {
                            $unwind: '$materials', // Unwind the materials array
                        },
                        {
                            $unwind: '$materials', // Unwind the materials array
                        },
                        {
                            $group: {
                                _id: '$materials._id',
                                name: { $first: '$materials.name' },
                                count: { $sum: 1 },
                            },
                        },
                        {
                            $sort: {
                                // Specify the field you want to use for sorting, e.g., '_id'
                                'name': 1,
                            },
                        },
                    ],
                    furnitures: [
                        {
                            $unwind: '$furnitures', // Unwind the materials array
                        },
                        {
                            $group: {
                                _id: '$furnitures._id',
                                name: { $first: '$furnitures.name' },
                                imgURL: { $first: '$furnitures.imgURL' },
                                price: { $first: '$furnitures.price' },
                            },
                        },
                        {
                            $sort: {
                                // Specify the field you want to use for sorting, e.g., '_id'
                                'price': sortAsc,
                            },
                        },
                    ],
                },
            },
            {
                $project: {
                    _id: 0,
                    furnitures: { $slice: ['$furnitures', startIndex, itemsPerPage] },
                    page: `${page}`,
                    totalPages: {
                        $ceil: {
                            $divide: [{ $size: "$furnitures" }, 10]
                        }
                    },
                    materials: 1,
                    colors: 1,
                },
            },
        ]);
        // data = await Furniture.find({ classifications: new ObjectId(id) })
        //     .skip(startIndex).limit(itemsPerPage)
        //     .select('name classifications')

        return {
            status: 200,
            data: data[0],
            message: data.length !== 0 ? "OK" : "No data"
        };

    } catch (error) {
        console.error(error);
        return {
            status: 500,
            messageError: error,
        }
    } finally {
        // Close the database connection
        mongoose.connection.close();
    }
}

export const filterSessionService = async (reqData) => {
    try {
        const { classificationId, sort_by, colorId, materialId } = reqData;
        const pageReq = reqData.page;
        let data = {};

        //Validate classificationId
        const idClassificationValid = await isIdValid(classificationId, 'classification');
        if (!idClassificationValid.isValid && idClassificationValid.messageError === 'ObjectId classification required.') {
            return {
                status: idClassificationValid.status,
                data: data,
                messageError: idClassificationValid.messageError
            }
        }

        //Validate colorId
        const idColorValid = await isIdValid(colorId, 'color');
        if (!idColorValid.isValid && idColorValid.messageError === 'ObjectId color required.') {
            return {
                status: idColorValid.status,
                data: data,
                messageError: idColorValid.messageError
            }
        }

        //Validate materialId
        const idMaterialValid = await isIdValid(materialId, 'material');
        if (!idMaterialValid.isValid && idMaterialValid.messageError === 'ObjectId material required.') {
            return {
                status: idMaterialValid.status,
                data: data,
                messageError: idMaterialValid.messageError
            }
        }

        const sortAsc = sortByInput(sort_by);

        // Parse query parameters
        const page = parseInt(pageReq) || 1;

        if (idClassificationValid.messageError === 'Not a valid classification ObjectId.'
            && idColorValid.isValid && idMaterialValid.isValid) { //filter with no classificationId
            console.log('Filter with colorId and materialId due to wrong classificationId.');
            let returnData = await getFurnitureByColorIdAndMaterialId(colorId, materialId, page, sortAsc);
            returnData.message = 'Filter with colorId and materialId due to wrong classificationId.'
            return returnData;
        } else if (idClassificationValid.messageError === 'Not a valid classification ObjectId.'
            && idColorValid.messageError === 'Not a valid color ObjectId.'
            && idMaterialValid.isValid) { //filter with just materialId
            console.log('Filter with just materialId due to wrong classificationId and colorId.');
            let returnData = await getFurnitureByMaterialId(materialId, page, sortAsc);
            returnData.message = 'Filter with just materialId due to wrong classificationId and colorId.'
            return returnData;
        } else if (idClassificationValid.messageError === 'Not a valid classification ObjectId.'
            && idMaterialValid.messageError === 'Not a valid material ObjectId.'
            && idColorValid.isValid) { //filter with just colorId
            console.log('Filter with just colorId due to wrong classificationId and materialId.');
            let returnData = await getFurnitureByColorId(colorId, page, sortAsc);
            returnData.message = 'Filter with just colorId due to wrong classificationId and materialId.'
            return returnData;
        } else if (idClassificationValid.isValid
            && idColorValid.isValid
            && idMaterialValid.messageError === 'Not a valid material ObjectId.') { //filter with classificationId, colorId
            console.log('Filter with classificationId and colorId due to wrong materialId.');
            let returnData = await getFurnitureByClassificationIdAndColorId(classificationId, colorId, page, sortAsc);
            returnData.message = 'Filter with classificationId and colorId due to wrong materialId.'
            return returnData;
        } else if (idClassificationValid.isValid
            && idMaterialValid.isValid
            && idColorValid.messageError === 'Not a valid color ObjectId.') { //filter with classificationId, materialId

        } else if (idClassificationValid.isValid
            && idMaterialValid.isValid
            && idColorValid.isValid) { //filter with classificationId, colorId and materialId

        } else if (idClassificationValid.isValid
            && idMaterialValid.messageError === 'Not a valid material ObjectId.'
            && idColorValid.messageError === 'Not a valid color ObjectId.') { //filter with just classificationId
            console.log('Filter with just classificationId due to wrong colorId and materialId.');
            let returnData = await getFurnitureByClassificationId(classificationId, page, sort_by);
            returnData.message = 'Filter with just classificationId due to wrong colorId and materialId.'
            return returnData;
        } else {
            console.log('else');
            return {
                status: 400,
                data: data,
                messageError: "No filter for this data"
            };
        }

        //TODO: Continuing here, use this to done the if else code above
        data = await Furniture.aggregate([
            {
                $lookup: {
                    from: 'color',
                    localField: 'colors',
                    foreignField: '_id',
                    as: 'colorsData',
                },
            },
            {
                $lookup: {
                    from: 'material',
                    localField: 'materials',
                    foreignField: '_id',
                    as: 'materialsData',
                },
            },
            {
                $lookup: {
                    from: 'classification',
                    localField: 'classifications',
                    foreignField: '_id',
                    as: 'classificationsData',
                },
            },
            {
                $unwind: '$classificationsData', // Unwind the classifications array
            },
            {
                $group: {
                    _id: '$classificationsData._id',
                    colors: { $push: '$colorsData' },
                    materials: { $push: '$materialsData' },
                    furnitures: {
                        $addToSet: {
                            _id: '$_id',
                            name: '$name',
                            imgURL: '$imgURL',
                            price: '$price',
                        },
                    },
                },
            },
            {
                $match: {
                    '_id': new ObjectId(classificationId),
                },
            },
            { // Separate the groups for colors, materials and furnitures
                $facet: {
                    colors: [
                        {
                            $unwind: '$colors', // Unwind the colors array
                        },
                        {
                            $unwind: '$colors', // Unwind the colors array
                        },
                        {
                            $group: {
                                _id: '$colors._id',
                                name: { $first: '$colors.name' },
                                count: { $sum: 1 },
                            },
                        },
                        {
                            $sort: {
                                // Specify the field you want to use for sorting, e.g., '_id'
                                'name': 1,
                            },
                        },
                    ],
                    materials: [
                        {
                            $unwind: '$materials', // Unwind the materials array
                        },
                        {
                            $unwind: '$materials', // Unwind the materials array
                        },
                        {
                            $group: {
                                _id: '$materials._id',
                                name: { $first: '$materials.name' },
                                count: { $sum: 1 },
                            },
                        },
                        {
                            $sort: {
                                // Specify the field you want to use for sorting, e.g., '_id'
                                'name': 1,
                            },
                        },
                    ],
                    furnitures: [
                        {
                            $unwind: '$furnitures', // Unwind the materials array
                        },
                        {
                            $group: {
                                _id: '$furnitures._id',
                                name: { $first: '$furnitures.name' },
                                imgURL: { $first: '$furnitures.imgURL' },
                                price: { $first: '$furnitures.price' },
                            },
                        },
                        {
                            $sort: {
                                // Specify the field you want to use for sorting, e.g., '_id'
                                'price': sortAsc,
                            },
                        },
                    ],
                },
            },
            {
                $project: {
                    _id: 0,
                    // furnitures: { $slice: ['$furnitures', startIndex, itemsPerPage] },
                    materials: 1,
                    colors: 1,
                },
            },
        ]);

        return {
            status: 200,
            data: data,
            message: data.length !== 0 ? "OK" : "No data"
        };

    } catch (error) {
        console.error(error);
        return {
            status: 500,
            messageError: error,
        }
    } finally {
        // Close the database connection
        mongoose.connection.close();
    }
}

export const getFurnitureByColorIdAndMaterialId = async (colorId, materialId, page, sortAsc) => {
    try {
        // Get the data for the current page
        const url = process.env.URL_DB;
        await mongoose.connect(url, { family: 4, dbName: 'interiorConstruction' });

        let data = {}

        const itemsPerPage = 10;

        // Calculate start and end indices for the current page
        const startIndex = (page - 1) * itemsPerPage;

        data = await Furniture.aggregate([
            {
                $match: {
                    'type': 'DEFAULT',
                },
            },
            { // Separate the groups for colors, materials and furnitures
                $facet: {
                    colors: [
                        {
                            $lookup: {
                                from: 'color',
                                localField: 'colors',
                                foreignField: '_id',
                                as: 'colorsData',
                            },
                        },
                        {
                            $unwind: '$colorsData', // Unwind the colorsData array
                        },
                        {
                            $group: {
                                _id: '$colorsData._id',
                                name: { $first: '$colorsData.name' },
                                count: { $sum: 1 },
                            },
                        },
                        {
                            $sort: {
                                // Specify the field you want to use for sorting, e.g., '_id'
                                'name': 1,
                            },
                        },
                    ],
                    materials: [
                        {
                            $lookup: {
                                from: 'material',
                                localField: 'materials',
                                foreignField: '_id',
                                as: 'materialsData',
                            },
                        },
                        {
                            $unwind: '$materialsData', // Unwind the materialsData array
                        },
                        {
                            $group: {
                                _id: '$materialsData._id',
                                name: { $first: '$materialsData.name' },
                                count: { $sum: 1 },
                            },
                        },
                        {
                            $sort: {
                                // Specify the field you want to use for sorting, e.g., '_id'
                                'name': 1,
                            },
                        },
                    ],
                    furnitures: [
                        {
                            $match: {
                                'colors': new ObjectId(colorId),
                                'materials': new ObjectId(materialId),
                            },
                        },
                        {
                            $lookup: {
                                from: 'color',
                                localField: 'colors',
                                foreignField: '_id',
                                as: 'colorsData',
                            },
                        },
                        {
                            $lookup: {
                                from: 'material',
                                localField: 'materials',
                                foreignField: '_id',
                                as: 'materialsData',
                            },
                        },
                        {
                            $group: {
                                _id: '$_id',
                                name: { $first: '$name' },
                                imgURL: { $first: '$imgURL' },
                                price: { $first: '$price' },
                            },
                        },
                        {
                            $sort: {
                                // Specify the field you want to use for sorting, e.g., '_id'
                                'price': sortAsc,
                            },
                        },
                    ],
                },
            },
            {
                $project: {
                    colors: 1,
                    materials: 1,
                    furnitures: { $slice: ['$furnitures', startIndex, itemsPerPage] },
                    page: `${page}`,
                    totalPages: {
                        $ceil: {
                            $divide: [{ $size: "$furnitures" }, 10]
                        }
                    },
                },
            },
        ]);

        return {
            status: 200,
            data: data[0],
            message: data.length !== 0 ? "OK" : "No data"
        };

    } catch (error) {
        console.error(error);
        return {
            status: 500,
            messageError: error,
        }
    } finally {
        // Close the database connection
        mongoose.connection.close();
    }
}

export const getFurnitureByMaterialId = async (materialId, page, sortAsc) => {
    try {
        // Get the data for the current page
        const url = process.env.URL_DB;
        await mongoose.connect(url, { family: 4, dbName: 'interiorConstruction' });

        let data = {}

        const itemsPerPage = 10;

        // Calculate start and end indices for the current page
        const startIndex = (page - 1) * itemsPerPage;

        data = await Furniture.aggregate([
            {
                $match: {
                    'type': 'DEFAULT',
                },
            },
            { // Separate the groups for colors, materials and furnitures
                $facet: {
                    colors: [
                        {
                            $lookup: {
                                from: 'color',
                                localField: 'colors',
                                foreignField: '_id',
                                as: 'colorsData',
                            },
                        },
                        {
                            $unwind: '$colorsData', // Unwind the colorsData array
                        },
                        {
                            $group: {
                                _id: '$colorsData._id',
                                name: { $first: '$colorsData.name' },
                                count: { $sum: 1 },
                            },
                        },
                        {
                            $sort: {
                                // Specify the field you want to use for sorting, e.g., '_id'
                                'name': 1,
                            },
                        },
                    ],
                    materials: [
                        {
                            $lookup: {
                                from: 'material',
                                localField: 'materials',
                                foreignField: '_id',
                                as: 'materialsData',
                            },
                        },
                        {
                            $unwind: '$materialsData', // Unwind the materialsData array
                        },
                        {
                            $group: {
                                _id: '$materialsData._id',
                                name: { $first: '$materialsData.name' },
                                count: { $sum: 1 },
                            },
                        },
                        {
                            $sort: {
                                // Specify the field you want to use for sorting, e.g., '_id'
                                'name': 1,
                            },
                        },
                    ],
                    furnitures: [
                        {
                            $match: {
                                'materials': new ObjectId(materialId),
                            },
                        },
                        {
                            $lookup: {
                                from: 'color',
                                localField: 'colors',
                                foreignField: '_id',
                                as: 'colorsData',
                            },
                        },
                        {
                            $lookup: {
                                from: 'material',
                                localField: 'materials',
                                foreignField: '_id',
                                as: 'materialsData',
                            },
                        },
                        {
                            $group: {
                                _id: '$_id',
                                name: { $first: '$name' },
                                imgURL: { $first: '$imgURL' },
                                price: { $first: '$price' },
                            },
                        },
                        {
                            $sort: {
                                // Specify the field you want to use for sorting, e.g., '_id'
                                'price': sortAsc,
                            },
                        },
                    ],
                },
            },
            {
                $project: {
                    colors: 1,
                    materials: 1,
                    furnitures: { $slice: ['$furnitures', startIndex, itemsPerPage] },
                    page: `${page}`,
                    totalPages: {
                        $ceil: {
                            $divide: [{ $size: "$furnitures" }, 10]
                        }
                    },
                },
            },
        ]);

        return {
            status: 200,
            data: data[0],
            message: data.length !== 0 ? "OK" : "No data"
        };

    } catch (error) {
        console.error(error);
        return {
            status: 500,
            messageError: error,
        }
    } finally {
        // Close the database connection
        mongoose.connection.close();
    }
}

export const getFurnitureByColorId = async (colorId, page, sortAsc) => {
    try {
        // Get the data for the current page
        const url = process.env.URL_DB;
        await mongoose.connect(url, { family: 4, dbName: 'interiorConstruction' });

        let data = {}

        const itemsPerPage = 10;

        // Calculate start and end indices for the current page
        const startIndex = (page - 1) * itemsPerPage;

        data = await Furniture.aggregate([
            {
                $match: {
                    'type': 'DEFAULT',
                },
            },
            { // Separate the groups for colors, materials and furnitures
                $facet: {
                    colors: [
                        {
                            $lookup: {
                                from: 'color',
                                localField: 'colors',
                                foreignField: '_id',
                                as: 'colorsData',
                            },
                        },
                        {
                            $unwind: '$colorsData', // Unwind the colorsData array
                        },
                        {
                            $group: {
                                _id: '$colorsData._id',
                                name: { $first: '$colorsData.name' },
                                count: { $sum: 1 },
                            },
                        },
                        {
                            $sort: {
                                // Specify the field you want to use for sorting, e.g., '_id'
                                'name': 1,
                            },
                        },
                    ],
                    materials: [
                        {
                            $lookup: {
                                from: 'material',
                                localField: 'materials',
                                foreignField: '_id',
                                as: 'materialsData',
                            },
                        },
                        {
                            $unwind: '$materialsData', // Unwind the materialsData array
                        },
                        {
                            $group: {
                                _id: '$materialsData._id',
                                name: { $first: '$materialsData.name' },
                                count: { $sum: 1 },
                            },
                        },
                        {
                            $sort: {
                                // Specify the field you want to use for sorting, e.g., '_id'
                                'name': 1,
                            },
                        },
                    ],
                    furnitures: [
                        {
                            $match: {
                                'colors': new ObjectId(colorId),
                            },
                        },
                        {
                            $lookup: {
                                from: 'color',
                                localField: 'colors',
                                foreignField: '_id',
                                as: 'colorsData',
                            },
                        },
                        {
                            $lookup: {
                                from: 'material',
                                localField: 'materials',
                                foreignField: '_id',
                                as: 'materialsData',
                            },
                        },
                        {
                            $group: {
                                _id: '$_id',
                                name: { $first: '$name' },
                                imgURL: { $first: '$imgURL' },
                                price: { $first: '$price' },
                            },
                        },
                        {
                            $sort: {
                                // Specify the field you want to use for sorting, e.g., '_id'
                                'price': sortAsc,
                            },
                        },
                    ],
                },
            },
            {
                $project: {
                    colors: 1,
                    materials: 1,
                    furnitures: { $slice: ['$furnitures', startIndex, itemsPerPage] },
                    page: `${page}`,
                    totalPages: {
                        $ceil: {
                            $divide: [{ $size: "$furnitures" }, 10]
                        }
                    },
                },
            },
        ]);

        return {
            status: 200,
            data: data[0],
            message: data.length !== 0 ? "OK" : "No data"
        };

    } catch (error) {
        console.error(error);
        return {
            status: 500,
            messageError: error,
        }
    } finally {
        // Close the database connection
        mongoose.connection.close();
    }
}

export const getFurnitureByClassificationIdAndColorId = async (classificationId, colorId, page, sortAsc) => {
    try {
        let data = {};

        const itemsPerPage = 10;

        // Calculate start and end indices for the current page
        const startIndex = (page - 1) * itemsPerPage;

        // Get the data for the current page
        const url = process.env.URL_DB;
        await mongoose.connect(url, { family: 4, dbName: 'interiorConstruction' });

        data = await Furniture.aggregate([
            {
                $match: {
                    'type': 'DEFAULT',
                    'classifications': new ObjectId(classificationId),
                    'colors': new ObjectId(colorId),
                },
            },
            {
                $facet: {
                    colors: [
                        {
                            $lookup: {
                                from: 'color',
                                localField: 'colors',
                                foreignField: '_id',
                                as: 'colorsData',
                            },
                        },
                        {
                            $unwind: '$colorsData', // Unwind the colorsData array
                        },
                        {
                            $group: {
                                _id: '$colorsData._id',
                                name: { $first: '$colorsData.name' },
                                count: { $sum: 1 },
                            },
                        },
                        {
                            $sort: {
                                // Specify the field you want to use for sorting, e.g., '_id'
                                'name': 1,
                            },
                        },
                    ],
                    materials: [
                        {
                            $lookup: {
                                from: 'material',
                                localField: 'materials',
                                foreignField: '_id',
                                as: 'materialsData',
                            },
                        },
                        {
                            $unwind: '$materialsData', // Unwind the materialsData array
                        },
                        {
                            $group: {
                                _id: '$materialsData._id',
                                name: { $first: '$materialsData.name' },
                                count: { $sum: 1 },
                            },
                        },
                        {
                            $sort: {
                                // Specify the field you want to use for sorting, e.g., '_id'
                                'name': 1,
                            },
                        },
                    ],
                    furnitures: [
                        {
                            $group: {
                                _id: '$_id',
                                name: { $first: '$name' },
                                imgURL: { $first: '$imgURL' },
                                price: { $first: '$price' },
                            },
                        },
                        {
                            $sort: {
                                // Specify the field you want to use for sorting, e.g., '_id'
                                'price': sortAsc,
                            },
                        },
                    ]
                }
            },

            {
                $project: {
                    _id: 0,
                    furnitures: { $slice: ['$furnitures', startIndex, itemsPerPage] },
                    page: `${page}`,
                    totalPages: {
                        $ceil: {
                            $divide: [{ $size: "$furnitures" }, 10]
                        }
                    },
                },
            },
        ]);

        return {
            status: 200,
            data: data[0],
            message: data.length !== 0 ? "OK" : "No data"
        };

    } catch (error) {
        console.error(error);
        return {
            status: 500,
            messageError: error,
        }
    } finally {
        // Close the database connection
        mongoose.connection.close();
    }
}

export const getFurnitureByType = async (furType) => {
    try {
        let data = [];

        // Get the data for the current page
        const url = process.env.URL_DB;
        await mongoose.connect(url, { family: 4, dbName: 'interiorConstruction' });
        const isValid = validateType(furType);
        if (!isValid) {
            return {
                status: 400,
                data: data,
                messageError: "Type must be 'DEFAULT' or 'CUSTOM'"
            }
        }
        data = await Furniture.find({ type: furType.toUpperCase() }).populate('colors').populate('materials').populate('delivery').populate('classifications');
        return {
            status: 200,
            data: data,
            message: data.length !== 0 ? "OK" : "No data"
        };

    } catch (error) {
        console.error(error);
        return {
            status: 500,
            messageError: error,
        }
    } finally {
        // Close the database connection
        mongoose.connection.close();
    }
}

export const getFurnitureByClassificationByType = async (classificationType) => {
    try {
        let data = [];

        // Get the data for the current page
        const url = process.env.URL_DB;
        await mongoose.connect(url, { family: 4, dbName: 'interiorConstruction' });
        const isValid = validateClassificationType(classificationType);
        if (!isValid) {
            return {
                status: 400,
                data: data,
                messageError: "Type must be 'PRODUCT' || 'ROOM' || 'STYLE' and cannot be empty."
            }
        }

        //Này là code cách 2: Aggregation pipeline
        data = await Furniture.aggregate([
            {
                $lookup: {
                    from: 'classification',
                    localField: 'classifications',
                    foreignField: '_id',
                    as: 'classifications',
                },
            },
            {
                $match: {
                    'classifications.type': classificationType.toUpperCase(),
                },
            },
            {
                $lookup: {
                    from: 'color',
                    localField: 'colors',
                    foreignField: '_id',
                    as: 'colors',
                },
            },
            {
                $lookup: {
                    from: 'material',
                    localField: 'materials',
                    foreignField: '_id',
                    as: 'materials',
                },
            },
            {
                $lookup: {
                    from: 'delivery',
                    localField: 'delivery',
                    foreignField: '_id',
                    as: 'delivery',
                },
            },
        ]);
        return {
            status: 200,
            data: data,
            message: data.length !== 0 ? "OK" : "No data"
        };

    } catch (error) {
        console.error(error);
        return {
            status: 500,
            messageError: error,
        }
    } finally {
        // Close the database connection
        mongoose.connection.close();
    }
}

export const getFurnitureByClassificationByName = async (classificationName) => {
    try {
        let data = [];

        // Get the data for the current page
        const url = process.env.URL_DB;
        await mongoose.connect(url, { family: 4, dbName: 'interiorConstruction' });
        if (!classificationName) {
            return {
                status: 400,
                data: data,
                messageError: "Classification name cannot be empty."
            }
        }

        data = await Furniture.aggregate([
            {
                $lookup: {
                    from: 'classification',
                    localField: 'classifications',
                    foreignField: '_id',
                    as: 'classifications',
                },
            },
            {
                $match: {
                    'classifications.classificationName': {
                        $regex: classificationName,
                        $options: 'i',  // 'i' option makes the match case-insensitive
                    },
                },
            },
            {
                $lookup: {
                    from: 'color',
                    localField: 'colors',
                    foreignField: '_id',
                    as: 'colors',
                },
            },
            {
                $lookup: {
                    from: 'material',
                    localField: 'materials',
                    foreignField: '_id',
                    as: 'materials',
                },
            },
            {
                $lookup: {
                    from: 'delivery',
                    localField: 'delivery',
                    foreignField: '_id',
                    as: 'delivery',
                },
            },
        ]);
        return {
            status: 200,
            data: data,
            message: data.length !== 0 ? "OK" : "No data"
        };

    } catch (error) {
        console.error(error);
        return {
            status: 500,
            messageError: error,
        }
    } finally {
        // Close the database connection
        mongoose.connection.close();
    }
}

export const getFurnitureByMaterial = async (materialName) => {
    try {
        let data = [];

        // Get the data for the current page
        const url = process.env.URL_DB;
        await mongoose.connect(url, { family: 4, dbName: 'interiorConstruction' });

        if (!materialName) {
            return {
                status: 400,
                data: data,
                messageError: "Material name cannot be empty."
            }
        }

        data = await Furniture.aggregate([
            {
                $lookup: {
                    from: 'classification',
                    localField: 'classifications',
                    foreignField: '_id',
                    as: 'classifications',
                },
            },
            {
                $lookup: {
                    from: 'color',
                    localField: 'colors',
                    foreignField: '_id',
                    as: 'colors',
                },
            },
            {
                $lookup: {
                    from: 'material',
                    localField: 'materials',
                    foreignField: '_id',
                    as: 'materials',
                },
            },
            {
                $match: {
                    'materials.name': {
                        $regex: materialName,
                        $options: 'i',  // 'i' option makes the match case-insensitive
                    },
                },
            },
            {
                $lookup: {
                    from: 'delivery',
                    localField: 'delivery',
                    foreignField: '_id',
                    as: 'delivery',
                },
            },
        ]);
        return {
            status: 200,
            data: data,
            message: data.length !== 0 ? "OK" : "No data"
        };

    } catch (error) {
        console.error(error);
        return {
            status: 500,
            messageError: error,
        }
    } finally {
        // Close the database connection
        mongoose.connection.close();
    }
}

export const getFurnitureByColor = async (colorName) => {
    try {
        let data = [];

        // Get the data for the current page
        const url = process.env.URL_DB;
        await mongoose.connect(url, { family: 4, dbName: 'interiorConstruction' });

        if (!colorName) {
            return {
                status: 400,
                data: data,
                messageError: "Color name cannot be empty."
            }
        }

        data = await Furniture.aggregate([
            {
                $lookup: {
                    from: 'classification',
                    localField: 'classifications',
                    foreignField: '_id',
                    as: 'classifications',
                },
            },
            {
                $lookup: {
                    from: 'color',
                    localField: 'colors',
                    foreignField: '_id',
                    as: 'colors',
                },
            },
            {
                $match: {
                    'colors.name': {
                        $regex: colorName,
                        $options: 'i',  // 'i' option makes the match case-insensitive
                    },
                },
            },
            {
                $lookup: {
                    from: 'material',
                    localField: 'materials',
                    foreignField: '_id',
                    as: 'materials',
                },
            },
            {
                $lookup: {
                    from: 'delivery',
                    localField: 'delivery',
                    foreignField: '_id',
                    as: 'delivery',
                },
            },
        ]);
        return {
            status: 200,
            data: data,
            message: data.length !== 0 ? "OK" : "No data"
        };

    } catch (error) {
        console.error(error);
        return {
            status: 500,
            messageError: error,
        }
    } finally {
        // Close the database connection
        mongoose.connection.close();
    }
}

function validateType(input) {
    // Convert input to lowercase and compare
    const lowerCaseInput = input.toUpperCase();

    if (lowerCaseInput === "DEFAULT" || lowerCaseInput === "CUSTOM") {
        return true;  // Input is valid
    } else {
        return false; // Input is not valid
    }
}

function sortByInput(mode) {
    if (!mode) { //No input => Ascending
        return 1;
    }
    // Convert input to lowercase and compare
    const lowerCaseInput = mode.toUpperCase();

    if (lowerCaseInput === "DESC") {
        return -1;  // Descending
    } else {
        return 1; // Ascending
    }
}

function validateClassificationType(input) {
    if (!input) {
        return false;
    }
    // Convert input to lowercase and compare
    const lowerCaseInput = input.toUpperCase();

    if (lowerCaseInput === "PRODUCT" || lowerCaseInput === "ROOM" || lowerCaseInput === "STYLE") {
        return true;  // Input is valid
    } else {
        return false; // Input is not valid
    }
}

async function isIdValid(id, model) {
    if (id === null || id === undefined) {
        return {
            status: 400,
            isValid: false,
            messageError: `ObjectId ${model} required.`
        }
    }
    try {
        const url = process.env.URL_DB;
        await mongoose.connect(url, { family: 4, dbName: 'interiorConstruction' });

        const isValidObjectId = mongoose.Types.ObjectId.isValid(id);

        if (!isValidObjectId) {
            // The provided id is not a valid ObjectId
            return {
                status: 400,
                isValid: false,
                messageError: `Not a valid ${model} ObjectId.`
            }
        }

        let data = null;

        switch (model) {
            case 'color':
                // Check if the color with the given ObjectId exists in the database
                data = await Color.findById(id);
                break;
            case 'material':
                // Check if the material with the given ObjectId exists in the database
                data = await Material.findById(id);
                break;
            case 'classification':
                // Check if the classification with the given ObjectId exists in the database
                data = await Classification.findById(id);
                break;
            case 'furniture':
                // Check if the classification with the given ObjectId exists in the database
                data = await Furniture.findById(id);
                break;
            default:
                break;
        }

        if (data !== null) {
            return {
                isValid: true,
            }
        } else {
            return {
                status: 400,
                isValid: false,
                messageError: 'ObjectId not found.'
            }
        }
        return data !== null; // Returns true if data exists, false otherwise
    } catch (error) {
        console.error('Error checking ObjectId:', error);
        return {
            status: 500,
            isValid: false,
            messageError: error
        }
    } finally {
        // Close the database connection
        mongoose.connection.close();
    }
}
