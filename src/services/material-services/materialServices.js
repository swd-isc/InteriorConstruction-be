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
                error: error,
            }
        } else {
            try {
                await data.save();
                return {
                    status: 200,
                    data: data,
                };
            } catch (error) {
                error = {
                    errDuplicate: error.message
                }
                return {
                    status: 400,
                    error: error,
                }
            }
        }
    } catch (error) {
        return {
            status: 500,
            error: error,
        }
    } finally {
        // Close the database connection
        mongoose.connection.close();
    }
}
