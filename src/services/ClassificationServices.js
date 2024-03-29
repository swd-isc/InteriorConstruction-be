import Classification from '../models/Classification';
import Design from '../models/Design';
import Furniture from '../models/Furniture'

import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

export const classificationServices = {
    classificationByPage: async (pageReq) => {
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

            // Count all documents in the collection
            const totalDocuments = await Classification.countDocuments();

            // Calculate total pages
            const totalPages = Math.ceil(totalDocuments / itemsPerPage);

            currentPageData = await Classification.find({}).sort({ classificationName: 1 }).skip(startIndex).limit(itemsPerPage);
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
    },

    getClassificationAll: async () => {
        try {
            const url = process.env.URL_DB;
            await mongoose.connect(url, { family: 4, dbName: 'interiorConstruction' });

            const currentPageData = await Classification.find({});

            return {
                status: 200,
                data: currentPageData,
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
    },

    postClassification: async (reqBody) => {
        try {
            let data = [];
            const url = process.env.URL_DB;
            await mongoose.connect(url, { family: 4, dbName: 'interiorConstruction' });
            const classification = new Classification(reqBody);

            try {
                data = await classification.save();
            } catch (error) {
                return {
                    status: 400,
                    data: {},
                    messageError: error.message
                }
            }

            //Code for insert data
            // const classificationDocuments = [
            //     { classificationName: 'Test Classification', type: "ROOM" },
            //     { classificationName: 'Test Classification', type: "ROOM" },
            //     // Add more documents as needed
            // ];

            // let isError = false
            // for (let i = 0; i < classificationDocuments.length; i++) {
            //     try {
            //         const classification = new Classification(classificationDocuments[i]);
            //         await classification.validate();
            //     } catch (error) {
            //         console.error('classification', i, 'error:', error.message);
            //         isError = true;
            //     }
            // }
            // isError = await checkDupName(classificationDocuments);

            // if (!isError) {
            //     for (let i = 0; i < classificationDocuments.length; i++) {
            //         try {
            //             const classification = new Classification(classificationDocuments[i]);
            //             await classification.save();
            //         } catch (error) {
            //             console.error('classification', i, 'error:', error.message);
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

    putClassification: async (classificationId, reqBody) => {
        try {
            let data = {};
            //Validate classificationId
            const idClassificationValid = await isIdValid(classificationId, 'classification');

            if (!idClassificationValid.isValid) {
                return {
                    status: idClassificationValid.status,
                    data: {},
                    messageError: idClassificationValid.messageError
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
                data = await Classification.findByIdAndUpdate(classificationId, reqBody, { runValidators: true, new: true });
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
    },

    deleteClassification: async (classificationId) => {
        try {
            let data = {};
            //Validate classificationId
            const idClassificationValid = await isIdValid(classificationId, 'classification');

            if (!idClassificationValid.isValid) {
                return {
                    status: idClassificationValid.status,
                    data: {},
                    messageError: idClassificationValid.messageError
                }
            }

            const url = process.env.URL_DB;
            await mongoose.connect(url, { family: 4, dbName: 'interiorConstruction' });

            try {

            // Check if any furniture references the classification
            const furnitureWithClassification = await Furniture.findOne({ classifications: classificationId });
            if (furnitureWithClassification) {
                return {
                    status: 400,
                    data: {},
                    messageError: 'Cannot delete classification because it is referenced by one or more furnitures.'
                };
            }

            // Check if any design references the classification
            const designWithClassification = await Design.findOne({ classifications: classificationId });
            if (designWithClassification) {
                return {
                    status: 400,
                    data: {},
                    messageError: 'Cannot delete classification because it is referenced by one or more designs.'
                };
            }
            
            data = await Classification.findOneAndDelete({ _id: new ObjectId(classificationId) });
            } catch (error) {
                return {
                    status: 400,
                    data: {},
                    messageError: 'error day ' + error.message
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
    },



    classificationByType: async (classificationType, mode) => {
        try {
            let sortAsc = sortByInput(mode);
            let data = [];

            // Get the data for the current page
            const url = process.env.URL_DB;
            await mongoose.connect(url, { family: 4, dbName: 'interiorConstruction' });
            const isValid = validateType(classificationType);
            if (!isValid) {
                return {
                    status: 400,
                    data: data,
                    messageError: "Type must be 'PRODUCT' | 'ROOM' | 'STYLE'"
                }
            }
            data = await Classification.find({ type: classificationType.toUpperCase() })
                .select("classificationName")
                .sort({ classificationName: sortAsc }); // 1 for ascending order, -1 for descending order
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
            case 'classification':
                // Check if the classification with the given ObjectId exists in the database
                data = await Classification.findById(id);
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
        if (uniqueNames.has(item.classificationName)) {
            console.log('Dup:', item.classificationName);
            return true; // Duplicate classificationName found
        }
        uniqueNames.add(item.classificationName);
    }

    return false; // All item classificationNames are unique
}
