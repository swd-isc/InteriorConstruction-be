import Furniture from '../models/Furniture';
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

        // const result = await Furniture.aggregate([
        //     {
        //         $skip: startIndex, // Skip documents based on the starting index
        //     },
        //     {
        //         $limit: itemsPerPage, // Limit the number of documents per page
        //     },
        //     {
        //         $lookup: {
        //             from: 'color', // Assuming your color schema collection is named 'colors'
        //             localField: 'colors',
        //             foreignField: '_id',
        //             as: 'colorsData',
        //         },
        //     },
        //     {
        //         $unwind: '$colorsData', // Unwind the colors array
        //     },
        //     {
        //         $lookup: {
        //             from: 'material', // Assuming your color schema collection is named 'colors'
        //             localField: 'materials',
        //             foreignField: '_id',
        //             as: 'materialsData',
        //         },
        //     },
        //     {
        //         $unwind: '$materialsData', // Unwind the colors array
        //     },
        //     {
        //         $group: {
        //             _id: null, // Group all documents together
        //             uniqueColors: { $addToSet: '$colorsData._id' }, // Add unique color IDs to the set
        //             totalColors: { $sum: 1 }, // Count the total number of colors
        //             uniqueMaterials: { $addToSet: '$materialsData._id' }, // Add unique material IDs to the set
        //             totalMaterials: { $sum: 1 }, // Count the total number of materials
        //             furnitureData: { $push: '$$ROOT' }, // Accumulate the furniture data
        //         },
        //     },
        //     {
        //         $project: {
        //             _id: 0, // Exclude _id field
        //             uniqueMaterials: { $size: '$uniqueMaterials' }, // Count the number of unique materials
        //             totalMaterials: 1, // Include totalMaterials
        //             uniqueColors: { $size: '$uniqueColors' }, // Count the number of unique colors
        //             totalColors: 1, // Include totalColors
        //             furnitures: {
        //                 $map: {
        //                     input: '$furnitureData',
        //                     as: 'furniture',
        //                     in: {
        //                         _id: '$$furniture._id',
        //                         name: '$$furniture.name',
        //                         imgURL: '$$furniture.imgURL',
        //                         price: '$$furniture.price',
        //                     },
        //                 },
        //             }, // Include furniture data
        //         },
        //     },
        // ]);

        const result = await Furniture.aggregate([
            {
                $skip: startIndex, // Skip documents based on the starting index
            },
            {
                $limit: itemsPerPage, // Limit the number of documents per page
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
                $unwind: '$colorsData', // Unwind the colors array
            },
            {
                $lookup: {
                    from: 'material', // Assuming your material schema collection is named 'material'
                    localField: 'materials',
                    foreignField: '_id',
                    as: 'materialsData',
                },
            },
            {
                $unwind: '$materialsData', // Unwind the materials array
            },
            {
                $lookup: {
                    from: 'classification', // Assuming your classification schema collection is named 'classification'
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
                    _id: {
                        color: '$colorsData._id',
                        material: '$materialsData._id',
                    },
                    countColors: { $sum: 1 },
                    countMaterials: { $sum: 1 },
                },
            },
            {
                $lookup: {
                    from: 'color',
                    localField: '_id.color',
                    foreignField: '_id',
                    as: 'colorInfo',
                },
            },
            {
                $lookup: {
                    from: 'material',
                    localField: '_id.material',
                    foreignField: '_id',
                    as: 'materialInfo',
                },
            },
            {
                $project: {
                    _id: 0,
                    color: { $arrayElemAt: ['$colorInfo.name', 0] }, // Get the color name
                    material: { $arrayElemAt: ['$materialInfo.name', 0] }, // Get the material name
                    countColors: 1,
                    countMaterials: 1,
                },
            },
            { //Group them into 2 arrays
                $group: {
                    _id: null,
                    colors: { $push: { name: '$color', count: '$countColors' } },
                    materials: { $push: { name: '$material', count: '$countMaterials' } },
                },
            },
            {
                $project: {
                    _id: 0,
                    colors: 1,
                    materials: 1,
                },
            },
        ]);

        console.log(result);

        currentPageData = await Furniture.find({}).sort({ price: sortAsc })
            .skip(startIndex).limit(itemsPerPage)
            .select('name imgURL price materials colors')
            .populate({
                path: "materials",
                select: 'name',
            })
            .populate({
                path: "colors",
                select: 'name',
            })
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
    // Get the data for the current page
    const url = process.env.URL_DB;
    await mongoose.connect(url, { family: 4, dbName: 'interiorConstruction' });

    try {
        if (!id) {
            return {
                status: 400,
                data: {},
                messageError: "Required Id"
            }
        }
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
        // .populate('classifications');
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

export const getFurnitureByClassificationId = async (id, pageReq) => {
    try {
        let data = [];

        if (!id) {
            return {
                status: 400,
                data: data,
                messageError: "Required classification Id."
            }
        }

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

        data = await Furniture.aggregate([
            // {
            //     $skip: startIndex, // Skip documents based on the starting index
            // },
            // {
            //     $limit: itemsPerPage, // Limit the number of documents per page
            // },
            {
                $lookup: {
                    from: 'color', // Assuming your color schema collection is named 'color'
                    localField: 'colors',
                    foreignField: '_id',
                    as: 'colorsData',
                },
            },
            {
                $unwind: '$colorsData', // Unwind the colors array
            },
            {
                $lookup: {
                    from: 'material', // Assuming your material schema collection is named 'material'
                    localField: 'materials',
                    foreignField: '_id',
                    as: 'materialsData',
                },
            },
            {
                $unwind: '$materialsData', // Unwind the materials array
            },
            {
                $lookup: {
                    from: 'classification', // Assuming your classification schema collection is named 'classification'
                    localField: 'classifications',
                    foreignField: '_id',
                    as: 'classificationsData',
                },
            },
            {
                $unwind: '$classificationsData', // Unwind the classifications array
            },
            {
                $match: {
                    'classificationsData._id': new ObjectId(id),
                },
            },
            {
                $group: {
                    _id: {
                        color: '$colorsData._id',
                        material: '$materialsData._id',
                    },
                    countColors: { $sum: 1 },
                    countMaterials: { $sum: 1 },
                    furnitures: {
                        $push: {
                            _id: '$_id',
                            name: '$name',
                            imgURL: '$imgURL',
                            price: '$price',
                        },
                    },
                },
            },
            {
                $lookup: {
                    from: 'color',
                    localField: '_id.color',
                    foreignField: '_id',
                    as: 'colorInfo',
                },
            },
            {
                $lookup: {
                    from: 'material',
                    localField: '_id.material',
                    foreignField: '_id',
                    as: 'materialInfo',
                },
            },
            {
                $project: {
                    _id: 0,
                    color: { $arrayElemAt: ['$colorInfo.name', 0] }, // Get the color name
                    material: { $arrayElemAt: ['$materialInfo.name', 0] }, // Get the material name
                    countColors: 1,
                    countMaterials: 1,
                    furnitures: 1,
                },
            },
            { // Separate the groups for colors and materials
                $facet: {
                    colorsGroup: [
                        {
                            $group: {
                                _id: '$color',
                                count: { $sum: '$countColors' },
                            },
                        },
                    ],
                    materialsGroup: [
                        {
                            $group: {
                                _id: '$material',
                                count: { $sum: '$countMaterials' },
                            },
                        },
                    ],
                    furnituresGroup: [
                        {
                            $unwind: '$furnitures',
                        },
                        {
                            $group: {
                                _id: '$furnitures._id',
                                furniture: { $first: '$furnitures' },
                            },
                        },
                        {
                            $group: {
                                _id: null,
                                furnitures: { $push: '$furniture' },
                            },
                        },
                    ],
                },
            },
            { // Merge the arrays
                $project: {
                    _id: 0,
                    colors: '$colorsGroup',
                    materials: '$materialsGroup',
                    // furnitures: { $arrayElemAt: ['$furnituresGroup.furnitures', 0] },
                    furnitures: {
                        $slice: [{ $arrayElemAt: ['$furnituresGroup.furnitures', 0] }, startIndex, itemsPerPage],
                    },
                },
            },
        ]);
        // data = await Furniture.find({ classifications: new ObjectId(id) })
        //     .skip(startIndex).limit(itemsPerPage)
        //     .select('name classifications')

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
