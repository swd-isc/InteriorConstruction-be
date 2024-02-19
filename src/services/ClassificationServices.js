import Classification from '../models/Classification';

import mongoose from "mongoose";

export const classificationByPage = async (pageReq) => {
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

        currentPageData = await Classification.find({}).sort({ classificationName: 1 }).skip(startIndex).limit(itemsPerPage).explain('executionStats');
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
            messageError: error,
        }
    } finally {
        // Close the database connection
        mongoose.connection.close();
    }
}

export const postClassification = async (reqBody) => {
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
            status: 200,
            data: data,
            message: data.length !== 0 ? "OK" : "No data"
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




export const classificationByType = async (classificationType, mode) => {
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
