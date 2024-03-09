import Material from '../models/Material';
import Furniture from '../models/Furniture';

import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

export const materialServices = {
    getMaterialByPage: async (pageReq) => {
        try {
            const itemsPerPage = 10;
            // Parse query parameters
            const page = parseInt(pageReq) || 1;

            let currentPageData = [];

            // Calculate start and end indices for the current page
            const startIndex = (page - 1) * itemsPerPage;

            // Get the data for the current page
            const url = process.env.URL_DB;
            await mongoose.connect(url, { family: 4, dbName: 'interiorConstruction' });

            currentPageData = await Material.find({}).sort({ name: 1 }).skip(startIndex).limit(itemsPerPage);
            return {
                status: 200,
                data: currentPageData,
                page: page,
                message: currentPageData.length !== 0 ? "OK" : "No data"
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

    createMaterial: async (reqBody) => {
        try {
            let data = [];
            const url = process.env.URL_DB;
            await mongoose.connect(url, { family: 4, dbName: 'interiorConstruction' });
            const material = new Material(reqBody);

            try {
                data = await material.save();
            } catch (error) {
                return {
                    status: 400,
                    data: {},
                    messageError: error.message
                }
            }

            //Code for insert data
            // const materialDocuments = [
            //     { name: 'Test Material', description: "test" },
            //     { name: 'Test Material', description: "test" },
            //     // Add more documents as needed
            // ];

            // let isError = false
            // for (let i = 0; i < materialDocuments.length; i++) {
            //     try {
            //         const material = new Material(materialDocuments[i]);
            //         await material.validate();
            //     } catch (error) {
            //         console.error('material', i, 'error:', error.message);
            //         isError = true;
            //     }
            // }
            // isError = await checkDupName(materialDocuments);

            // if (!isError) {
            //     for (let i = 0; i < materialDocuments.length; i++) {
            //         try {
            //             const material = new Material(materialDocuments[i]);
            //             await material.save();
            //         } catch (error) {
            //             console.error('material', i, 'error:', error.message);
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

    putMaterial: async (materialId, reqBody) => {
        try {
            let data = {};
            //Validate classificationId
            const idMaterialValid = await isIdValid(materialId, 'material');

            if (!idMaterialValid.isValid) {
                return {
                    status: idMaterialValid.status,
                    data: {},
                    messageError: idMaterialValid.messageError
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
                data = await Material.findByIdAndUpdate(materialId, reqBody, { runValidators: true, new: true });
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

    deleteMaterial: async (materialId) => {
        try {
            let data = {};
            //Validate classificationId
            const idMaterialValid = await isIdValid(materialId, 'material');

            if (!idMaterialValid.isValid) {
                return {
                    status: idMaterialValid.status,
                    data: {},
                    messageError: idMaterialValid.messageError
                }
            }

            const url = process.env.URL_DB;
            await mongoose.connect(url, { family: 4, dbName: 'interiorConstruction' });

            try {

                const furnitureWithMaterial = await Furniture.findOne({ materials: materialId });
                if (furnitureWithMaterial) {
                    return {
                        status: 400,
                        data: {},
                        messageError: 'Cannot delete material because it is referenced by one or more furnitures.'
                    };
                }

                data = await Material.findOneAndDelete({ _id: new ObjectId(materialId) });
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
                messageError: error,
            }
        } finally {
            // Close the database connection
            mongoose.connection.close();
        }
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
            case 'material':
                // Check if the material with the given ObjectId exists in the database
                data = await Material.findById(id);
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
