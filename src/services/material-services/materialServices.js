import Material from '../../models/Material';

import mongoose from "mongoose";

export const getMaterialByPage = async (pageReq) => {
    try {
        const itemsPerPage = 10;
        // Parse query parameters
        const page = parseInt(pageReq) || 1;
        let totalMaterials = 0;
        let currentPageData = [];

        // Calculate start and end indices for the current page
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = page * itemsPerPage;

        // Get the data for the current page
        const url = process.env.URL_DB;
        await mongoose.connect(url, { family: 4, dbName: 'interiorConstruction' });
        totalMaterials = await Material.countDocuments();

        if (totalMaterials > 0) {
            currentPageData = await Material.find({}).skip(startIndex).limit(endIndex);
            return {
                data: currentPageData,
                pagination: {
                    page: page,
                    itemsPerPage: itemsPerPage,
                    totalItems: totalMaterials,
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

export const createMaterial = async (material) => {
    try {
        const url = process.env.URL_DB;
        await mongoose.connect(url, { family: 4, dbName: 'interiorConstruction' }).then(async () => {
            let error = {};
            console.log('material: ', material);
            const data = new Material(material);
            error = data.validateSync();
            if (error) {
                if (error.errors['name']?.message) {
                    error = {
                        errName: error.errors['name'].message
                    }
                }
                if (error.errors['description']?.message) {
                    error = {
                        errName: error.errors['description'].message
                    }
                }
                return {
                    status: 400,
                    error: error,
                }
            } else {
                console.log('ko loi');
                try {
                    await data.save();
                    return {
                        status: 200,
                        data: data,
                    };
                } catch (error) {
                    console.log('check err: ', error.message);
                    return {
                        status: 400,
                        error: error.message,
                    }
                }
            }
        })
    } catch (error) {
        console.error(error.message);
    } finally {
        // Close the database connection
        mongoose.connection.close();
    }
}
