import Classification from '../models/Classification';

import mongoose from "mongoose";

export const getClassificationByPage = async (pageReq) => {
    try {
        const itemsPerPage = 10;
        // Parse query parameters
        const page = parseInt(pageReq) || 1;
        let totalClassifications = 0;
        let currentPageData = [];

        // Calculate start and end indices for the current page
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = page * itemsPerPage;

        // Get the data for the current page
        const url = process.env.URL_DB;
        await mongoose.connect(url, { family: 4, dbName: 'interiorConstruction' });
        totalClassifications = await Classification.countDocuments();

        if (totalClassifications > 0) {
            currentPageData = await Classification.find({}).skip(startIndex).limit(endIndex);
            return {
                data: currentPageData,
                pagination: {
                    page: page,
                    totalItems: totalClassifications,
                },
            };
        } else {
            return {
                status: 400,
                error: 'No data',
            }
        }
    } catch (error) {
        console.error(error);
        return {
            status: 500,
            error: error,
        }
    } finally {
        // Close the database connection
        mongoose.connection.close();
    }
}