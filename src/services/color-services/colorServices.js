import Color from '../../models/Color';

import mongoose from "mongoose";

export const getColorByPage = async (pageReq) => {
    try {
        const itemsPerPage = 10;
        // Parse query parameters
        const page = parseInt(pageReq) || 1;
        let totalColors = 0;
        let currentPageData = [];

        // Calculate start and end indices for the current page
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = page * itemsPerPage;

        // Get the data for the current page
        const url = process.env.URL_DB;
        await mongoose.connect(url, { family: 4, dbName: 'interiorConstruction' });
        totalColors = await Color.countDocuments();

        if (totalColors > 0) {
            currentPageData = await Color.find({}).skip(startIndex).limit(endIndex);
        }

        return {
            data: currentPageData,
            pagination: {
                page: page,
                itemsPerPage: itemsPerPage,
                totalItems: totalColors,
            },
        };
    } catch (error) {
        console.error(error);
        return {
            error: error,
        }
    } finally {
        // Close the database connection
        mongoose.connection.close();
    }
}