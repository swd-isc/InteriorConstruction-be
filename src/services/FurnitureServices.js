import Furniture from '../models/Furniture';
import Color from '../models/Color';
import Material from '../models/Material';
import Classification from '../models/Classification';
import Design from '../models/Design';

import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

export const furnitureServices = {
    userGetFurnitureByPage: async (mode, pageReq) => {
        try {
            const sortAsc = sortByInput(mode);
            const itemsPerPage = 10;
            // Parse query parameters
            const page = parseInt(pageReq) || 1;
            let data = [];

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

            // data = await Furniture.find({}).sort({ price: sortAsc })
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
                data: data[0],
                message: data.length !== 0 ? "OK" : "No data"
            };

        } catch (error) {
            console.error(error);
            return {
                status: 500,
                messageError: error.toString(),
            }
        } finally {
            // Close the database connection
            mongoose.connection.close();
        }
    },

    userGetFurnitureById: async (id) => {
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
            const data = await Furniture.find({ _id: id, type: "DEFAULT" })
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
            if (data.length !== 0) {
                return {
                    status: 200,
                    data: data[0],
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
                messageError: error.toString(),
            }
        } finally {
            // Close the database connection
            mongoose.connection.close();
        }
    },

    adminGetFurnitureByPage: async (mode, pageReq, type, classificationIds) => {
        try {
            const typeCheck = await checkType(type);
            const sortAsc = sortByInput(mode);
            const itemsPerPage = 10;
            // Parse query parameters
            const page = parseInt(pageReq) || 1;
            let data = [];

            // Calculate start and end indices for the current page
            const startIndex = (page - 1) * itemsPerPage;

            const classificationArray = classificationIds ? classificationIds.split(',').map(id => new ObjectId(id)) : [];
            // Get the data for the current page
            const url = process.env.URL_DB;
            await mongoose.connect(url, { family: 4, dbName: 'interiorConstruction' });

            console.log(classificationArray)

            data = await Furniture.aggregate([
                ...(type === 'default' ? [
                    {
                        $match: {
                            'type': 'DEFAULT',
                        },
                    }
                ] : []),
                ...(type === 'custom' ? [
                    {
                        $match: {
                            'type': 'CUSTOM',
                        },
                    }
                ] : []),
                ...(classificationArray.length > 0 ? [
                    {
                        $match: {
                            'classifications': { $all: classificationArray }
                        }
                    }
                ] : []),
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

            // data = await Furniture.find({}).sort({ price: sortAsc })
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
                data: data[0],
                message: data.length !== 0 ? "OK" : "No data"
            };

        } catch (error) {
            console.error(error);
            return {
                status: 500,
                messageError: error.toString(),
            }
        } finally {
            // Close the database connection
            mongoose.connection.close();
        }
    },

    adminGetFurnitureById: async (id) => {
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
                messageError: error.toString(),
            }
        } finally {
            // Close the database connection
            mongoose.connection.close();
        }
    },

    getFurnitureByClassificationId: async (id, pageReq, mode) => {
        try {
            let data = [];
            const idValid = await isIdValid(id, 'classification');

            if (!idValid.isValid) {
                return {
                    status: idValid.status,
                    data: data,
                    messageError: idValid.messageError
                }
            }
            const sortAsc = sortByInput(mode);

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
                                $match: {
                                    '_id': new ObjectId(id),
                                },
                            },
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
    },

    filterSessionService: async (reqData) => {
        try {
            const { classificationId, sort_by, colorId, materialId } = reqData;
            const pageReq = reqData.page;
            let data = {};

            //Validate classificationId
            const idClassificationValid = await isIdValid(classificationId, 'classification');

            //Validate colorId
            const idColorValid = await isIdValid(colorId, 'color');

            //Validate materialId
            const idMaterialValid = await isIdValid(materialId, 'material');

            const sortAsc = sortByInput(sort_by);

            // Parse query parameters
            const page = parseInt(pageReq) || 1;

            if (!idClassificationValid.isValid
                && idColorValid.isValid
                && idMaterialValid.isValid) { //filter with no classificationId
                console.log('Filter with colorId and materialId due to wrong classificationId.');
                let returnData = await furnitureServices.getFurnitureByColorIdAndMaterialId(colorId, materialId, page, sortAsc);
                returnData.message = 'Filter with colorId and materialId due to wrong classificationId.'
                return returnData;
            } else if (!idClassificationValid.isValid
                && !idColorValid.isValid
                && idMaterialValid.isValid) { //filter with just materialId
                console.log('Filter with just materialId due to wrong classificationId and colorId.');
                let returnData = await furnitureServices.getFurnitureByMaterialId(materialId, page, sortAsc);
                returnData.message = 'Filter with just materialId due to wrong classificationId and colorId.'
                return returnData;
            } else if (!idClassificationValid.isValid
                && !idMaterialValid.isValid
                && idColorValid.isValid) { //filter with just colorId
                console.log('Filter with just colorId due to wrong classificationId and materialId.');
                let returnData = await furnitureServices.getFurnitureByColorId(colorId, page, sortAsc);
                returnData.message = 'Filter with just colorId due to wrong classificationId and materialId.'
                return returnData;
            } else if (idClassificationValid.isValid
                && idColorValid.isValid
                && !idMaterialValid.isValid) { //filter with classificationId, colorId
                console.log('Filter with classificationId and colorId due to wrong materialId.');
                let returnData = await furnitureServices.getFurnitureByClassificationIdAndColorId(classificationId, colorId, page, sortAsc);
                returnData.message = 'Filter with classificationId and colorId due to wrong materialId.'
                return returnData;
            } else if (idClassificationValid.isValid
                && idMaterialValid.isValid
                && !idColorValid.isValid) { //filter with classificationId, materialId
                console.log('Filter with classificationId and materialId due to wrong colorId.');
                let returnData = await furnitureServices.getFurnitureByClassificationIdAndMaterialId(classificationId, materialId, page, sortAsc);
                returnData.message = 'Filter with classificationId and materialId due to wrong colorId.'
                return returnData;
            } else if (idClassificationValid.isValid
                && idMaterialValid.isValid
                && idColorValid.isValid) { //filter with classificationId, colorId and materialId
                console.log('Filter with classificationId, colorId and materialId.');
                let returnData = await furnitureServices.getFurnitureByClassificationIdColorIdAndMaterialId(classificationId, colorId, materialId, page, sortAsc);
                returnData.message = 'Filter with classificationId, colorId and materialId.'
                return returnData;
            } else if (idClassificationValid.isValid
                && !idMaterialValid.isValid
                && !idColorValid.isValid) { //filter with just classificationId
                console.log('Filter with just classificationId due to wrong colorId and materialId.');
                let returnData = await furnitureServices.getFurnitureByClassificationId(classificationId, page, sort_by);
                returnData.message = 'Filter with just classificationId due to wrong colorId and materialId.'
                return returnData;
            } else {
                return {
                    status: 400,
                    data: {},
                    messageError: "Required 1 of this id: clssificationId, colorId, materialId."
                };
            }

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
    },

    getFurnitureByColorIdAndMaterialId: async (colorId, materialId, page, sortAsc) => {
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
    },

    getFurnitureByMaterialId: async (materialId, page, sortAsc) => {
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
    },

    getFurnitureByColorId: async (colorId, page, sortAsc) => {
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
    },

    getFurnitureByClassificationIdAndColorId: async (classificationId, colorId, page, sortAsc) => {
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
                        'type': 'DEFAULT'
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
                                $match: {
                                    'classifications': new ObjectId(classificationId),
                                    'colors': new ObjectId(colorId),
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
                        ]
                    }
                },

                {
                    $project: {
                        _id: 0,
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
    },

    getFurnitureByClassificationIdAndMaterialId: async (classificationId, materialId, page, sortAsc) => {
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
                        'type': 'DEFAULT'
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
                                $match: {
                                    'classifications': new ObjectId(classificationId),
                                    'materials': new ObjectId(materialId),
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
                        ]
                    }
                },

                {
                    $project: {
                        _id: 0,
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
    },

    getFurnitureByClassificationIdColorIdAndMaterialId: async (classificationId, colorId, materialId, page, sortAsc) => {
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
                        'type': 'DEFAULT'
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
                                $match: {
                                    'classifications': new ObjectId(classificationId),
                                    'colors': new ObjectId(colorId),
                                    'materials': new ObjectId(materialId),
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
                        ]
                    }
                },

                {
                    $project: {
                        _id: 0,
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
    },

    postFurniture: async (reqBody) => {
        try {
            let data = [];
            const url = process.env.URL_DB;
            await mongoose.connect(url, { family: 4, dbName: 'interiorConstruction' });
            const furniture = new Furniture(reqBody);

            try {
                data = await furniture.save();
            } catch (error) {
                return {
                    status: 400,
                    data: {},
                    messageError: error.message
                }

            }

            //Code for insert data
            // const furnitureDocuments = [
            //     {
            //         "name": "Test",
            //         "imgURL": [
            //             "https://example.com/images/custom-velvet-sofa1.jpg",
            //             "https://example.com/images/custom-velvet-sofa2.jpg",
            //             "https://example.com/images/custom-velvet-sofa3.jpg"
            //         ],
            //         "description": "A luxurious velvet sofa customized for elegance and comfort.",
            //         "colors": [
            //             "65c3adaa88d6e0ef97d61309",
            //             "65c3adac88d6e0ef97d6131c"
            //         ],
            //         "materials": [
            //             "65c3ad92a62194b93e53221e",
            //             "65c3ad91a62194b93e532212"
            //         ],
            //         "sizes": "D2000 - R900 - C800 mm",
            //         "price": 2500,
            //         "returnExchangeCases": [
            //             "InteriorConstruction's products are warranted for one year for technical defects during production or installation.",
            //             "Customers should not attempt to repair the product themselves. Instead, contact InteriorConstruction immediately through the hotline: 0388415317.",
            //             "If the customer has any further questions or requests, please contact InteriorConstruction for guidance and problem-solving service."
            //         ],
            //         "nonReturnExchangeCases": [
            //             "The customer repairs the product themselves without any contact with InteriorConstruction.",
            //             "The product is not used in accordance with the warranty book (given when you buy the product), causing scratches, dents, dirt, or discoloration.",
            //             "The product is deformed due to abnormal external conditions (too humid, too dry, termites, or due to the impact of electrical equipment, chemicals, or solvents used by customers).",
            //             "The product’s warranty has expired.",
            //             "The product does not have InteriorConstruction's warranty card."
            //         ],
            //         "delivery": "65c90357db6eeb89cdbe26aa",
            //         "type": "DEFAULT",
            //         "classifications": [
            //             "65c3adc0b735ad08cd044340",
            //             "65c3adc0b735ad08cd044335"
            //         ]
            //     },
            //     {
            //         "name": "Test2",
            //         "imgURL": [
            //             "https://example.com/images/custom-velvet-sofa1.jpg",
            //             "https://example.com/images/custom-velvet-sofa2.jpg",
            //             "https://example.com/images/custom-velvet-sofa3.jpg"
            //         ],
            //         "description": "A luxurious velvet sofa customized for elegance and comfort.",
            //         "colors": [
            //             "65c3adaa88d6e0ef97d61309",
            //             "65c3adac88d6e0ef97d6131c"
            //         ],
            //         "materials": [
            //             "65c3ad92a62194b93e53221e",
            //             "65c3ad91a62194b93e532212"
            //         ],
            //         "sizes": "D2000 - R900 - C800 mm",
            //         "price": 2500,
            //         "returnExchangeCases": [
            //             "InteriorConstruction's products are warranted for one year for technical defects during production or installation.",
            //             "Customers should not attempt to repair the product themselves. Instead, contact InteriorConstruction immediately through the hotline: 0388415317.",
            //             "If the customer has any further questions or requests, please contact InteriorConstruction for guidance and problem-solving service."
            //         ],
            //         "nonReturnExchangeCases": [
            //             "The customer repairs the product themselves without any contact with InteriorConstruction.",
            //             "The product is not used in accordance with the warranty book (given when you buy the product), causing scratches, dents, dirt, or discoloration.",
            //             "The product is deformed due to abnormal external conditions (too humid, too dry, termites, or due to the impact of electrical equipment, chemicals, or solvents used by customers).",
            //             "The product’s warranty has expired.",
            //             "The product does not have InteriorConstruction's warranty card."
            //         ],
            //         "delivery": "65c90357db6eeb89cdbe26aa",
            //         "type": "DEFAULT",
            //         "classifications": [
            //             "65c3adc0b735ad08cd044340",
            //             "65c3adc0b735ad08cd044335"
            //         ]
            //     },
            //     // Add more documents as needed
            // ];

            // let isError = false
            // for (let i = 0; i < furnitureDocuments.length; i++) {
            //     try {
            //         const furniture = new Furniture(furnitureDocuments[i]);
            //         await furniture.validate();
            //     } catch (error) {
            //         console.error('furniture', i, 'error:', error.message);
            //         isError = true;
            //     }
            // }
            // isError = await checkDupName(furnitureDocuments);

            // if (!isError) {
            //     for (let i = 0; i < furnitureDocuments.length; i++) {
            //         try {
            //             const furniture = new Furniture(furnitureDocuments[i]);
            //             await furniture.save();
            //         } catch (error) {
            //             console.error('furniture', i, 'error:', error.message);
            //         }
            //     }
            // }

            return {
                status: 201,
                data: data,
                message: data.length !== 0 ? "OK" : "No data"
            };
        } catch (error) {
            console.error('error ne', error);
            return {
                status: 500,
                messageError: error.toString(),
            }
        } finally {
            // Close the database connection
            mongoose.connection.close();
        }
    },

    getFurnitureByName: async (furName, pageReq, mode) => {
        try {
            // Get the data for the current page
            const url = process.env.URL_DB;
            await mongoose.connect(url, { family: 4, dbName: 'interiorConstruction' });
            const regexPattern = new RegExp(furName, 'i'); // 'i' flag for case-insensitive search

            let data = {}

            const sortAsc = sortByInput(mode);

            const itemsPerPage = 10;

            const page = parseInt(pageReq) || 1;

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
                                    'name': { $regex: regexPattern },
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
    },

    putFurniture: async (furId, reqBody) => {
        try {
            let data = {};
            //Validate classificationId
            const idFurnitureValid = await isIdValid(furId, 'furniture');

            if (!idFurnitureValid.isValid) {
                return {
                    status: idFurnitureValid.status,
                    data: {},
                    messageError: idFurnitureValid.messageError
                }
            }

            if (!reqBody) {
                return {
                    status: 400,
                    data: {},
                    messageError: "Required body"
                }
            }

            const url = process.env.URL_DB;
            await mongoose.connect(url, { family: 4, dbName: 'interiorConstruction' });

            try {
                data = await Furniture.findByIdAndUpdate(furId, reqBody, { runValidators: true, new: true });
            } catch (error) {
                return {
                    status: 400,
                    data: {},
                    messageError: error.message
                }

            }

            return {
                status: 200,
                data: data !== null ? data : {},
                message: data !== null ? "OK" : "No data"
            };
        } catch (error) {
            console.error('error ne', error);
            return {
                status: 500,
                messageError: error.toString(),
            }
        } finally {
            // Close the database connection
            mongoose.connection.close();
        }
    },

    deleteFurniture: async (furId) => {
        try {
            let data = {};
            //Validate classificationId
            const idFurnitureValid = await isIdValid(furId, 'furniture');

            if (!idFurnitureValid.isValid) {
                return {
                    status: idFurnitureValid.status,
                    data: {},
                    messageError: idFurnitureValid.messageError
                }
            }

            const url = process.env.URL_DB;
            await mongoose.connect(url, { family: 4, dbName: 'interiorConstruction' });

            try {

                const designWithFurniture = await Design.findOne({ furnitures: furId });
                if (designWithFurniture) {
                    return {
                        status: 400,
                        data: {},
                        messageError: 'Cannot delete furniture because it is referenced by one or more designs.'
                    };
                }

                data = await Furniture.findOneAndDelete({ _id: new ObjectId(furId) })
                    .populate({
                        path: 'colors',
                        select: '-_id name'
                    })
                    .populate({
                        path: 'materials',
                        select: '-_id name'
                    })
                    .populate({
                        path: 'delivery',
                        select: '-_id'
                    })
                    .populate({
                        path: 'classifications',
                        select: '-_id classificationName'
                    });
            } catch (error) {
                return {
                    status: 400,
                    data: {},
                    messageError: error.message
                }

            }

            return {
                status: 200,
                data: data !== null ? data : {},
                message: data !== null ? "OK" : "No data"
            };
        } catch (error) {
            console.error('error ne', error);
            return {
                status: 500,
                messageError: error.toString(),
            }
        } finally {
            // Close the database connection
            mongoose.connection.close();
        }
    },




    getFurnitureByType: async (furType) => {
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
    },

    getFurnitureByClassificationByType: async (classificationType) => {
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
    },

    getFurnitureByClassificationByName: async (classificationName) => {
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
    },

    getFurnitureByMaterial: async (materialName) => {
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
    },

    getFurnitureByColor: async (colorName) => {
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
                isValid: true,// Returns true if data exists, false otherwise
            }
        } else {
            return {
                status: 400,
                isValid: false,
                messageError: 'ObjectId not found.'
            }
        }
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

async function checkDupName(arrays) {
    const uniqueNames = new Set();

    for (const item of arrays) {
        if (uniqueNames.has(item.name)) {
            console.log('Dup:', item.name);
            return true; // Duplicate name found
        }
        uniqueNames.add(item.name);
    }

    return false; // All item names are unique
}

async function checkType(type) {
    const upperCaseType = type?.toString().toUpperCase();

    switch (upperCaseType) {
        case "CUSTOM":
            return "custom";
        case "DEFAULT":
            return "default";
        default:
            return "undefined";
    }
}
