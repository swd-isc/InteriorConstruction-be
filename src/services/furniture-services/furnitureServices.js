import Furniture from '../../models/Furniture';

import mongoose from "mongoose";

export const getFurnitureByPage = async (pageReq) => {
    try {
        const itemsPerPage = 10;
        // Parse query parameters
        const page = parseInt(pageReq) || 1;
        let totalFurnitures = 0;
        let currentPageData = [];

        // Calculate start and end indices for the current page
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = page * itemsPerPage;

        // Get the data for the current page
        const url = process.env.URL_DB;
        await mongoose.connect(url, { family: 4, dbName: 'interiorConstruction' });
        totalFurnitures = await Furniture.countDocuments();

        if (totalFurnitures > 0) {
            currentPageData = await Furniture.find({}).populate('colors').populate('materials').populate('classifications').skip(startIndex).limit(endIndex);
            return {
                data: currentPageData,
                pagination: {
                    page: page,
                    itemsPerPage: itemsPerPage,
                    totalItems: totalFurnitures,
                },
            };
        } else {
            return {
                status: 404,
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