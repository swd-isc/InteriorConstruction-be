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

        const totalItems = await Furniture.countDocuments();
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        if (pageReq > totalPages) {
            return {
                status: 400,
                data: currentPageData,
                page: page,
                totalPages: totalPages,
                messageError: "Your page is higher than expected"
            };
        }

        currentPageData = await Furniture.aggregate([
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

        const totalItems = await Furniture.countDocuments();
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        if (pageReq > totalPages) {
            return {
                status: 400,
                data: data,
                page: page,
                totalPages: totalPages,
                messageError: "Your page is higher than expected"
            };
        }
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
        let { classificationId, sort_by, colorId, materialId } = reqData;
        let pageReq = reqData.page;
        let data = {};

        //Validate classificationId
        let idValid = await isIdValid(classificationId, 'classification');
        if (!idValid.isValid) {
            return {
                status: idValid.status,
                data: data,
                messageError: idValid.messageError
            }
        }

        //Validate colorId
        idValid = await isIdValid(colorId, 'color');
        if (!idValid.isValid) {
            return {
                status: idValid.status,
                data: data,
                messageError: idValid.messageError
            }
        }

        //Validate materialId
        idValid = await isIdValid(materialId, 'material');
        if (!idValid.isValid) {
            return {
                status: idValid.status,
                data: data,
                messageError: idValid.messageError
            }
        }

        let sortAsc = sortByInput(sort_by);

        const itemsPerPage = 10;
        // Parse query parameters
        const page = parseInt(pageReq) || 1;

        // Calculate start and end indices for the current page
        const startIndex = (page - 1) * itemsPerPage;

        if (!classificationId) { //filter with no classificationId

        } else if (!colorId && !materialId) { //filter with just classificationId

        } else if (colorId && !materialId) { //filter with classificationId, colorId

        } else if (!colorId && materialId) { //filter with classificationId, materialId

        } else { //filter with classificationId, colorId and materialId

        }

        // Get the data for the current page
        const url = process.env.URL_DB;
        await mongoose.connect(url, { family: 4, dbName: 'interiorConstruction' });

        const totalItems = await Furniture.countDocuments();
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        if (pageReq > totalPages) {
            return {
                status: 400,
                data: data,
                page: page,
                totalPages: totalPages,
                messageError: "Your page is higher than expected"
            };
        }



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
            messageError: 'ObjectId required.'
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
                messageError: 'Not a valid ObjectId.'
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
