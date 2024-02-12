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

export const createMaterial = async (material) => {
    try {
        const url = process.env.URL_DB;
        await mongoose.connect(url, { family: 4, dbName: 'interiorConstruction' })
        let error = {};
        console.log('material: ', material);
        const data = new Material(material);
        let err = data.validateSync();
        if (err) {
            if (err.errors['name']?.message) {
                error.errName = err.errors['name'].message;
            }
            if (err.errors['description']?.message) {
                error.errDescription = err.errors['description'].message;
            }

            return {
                status: 400,
                messageError: error,
            }
        } else {
            try {
                await data.save();
                return {
                    status: 200,
                    data: data,
                    message: "OK"
                };
            } catch (error) {
                error = {
                    errDuplicate: error.message
                }
                return {
                    status: 400,
                    messageError: error,
                }
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
