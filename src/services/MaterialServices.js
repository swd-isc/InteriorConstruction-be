import Material from '../models/Material';

import mongoose from "mongoose";

export const getMaterialByPage = async (pageReq) => {
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

        currentPageData = await Material.find({}).sort({ name: 1 }).skip(startIndex).limit(itemsPerPage).explain('executionStats');
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

export const createMaterial = async (reqBody) => {
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
