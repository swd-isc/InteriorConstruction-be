import Color from '../models/Color';
import ReturnPolicy from '../models/ReturnPolicy';
import Design from '../models/Design';
import Delivery from '../models/Delivery';
import Furniture from '../models/Furniture';

import mongoose from "mongoose";
import { returnPolicyData } from '../sample-data/ReturnPolicyData';
import { deliveryData } from '../sample-data/DeliveryData';
import { furnitureData } from '../sample-data/FurnitureData';
import { designData } from '../sample-data/DesignData';

export const getColorByPage = async (pageReq) => {
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

        currentPageData = await Color.find({}).sort({ name: 1 }).skip(startIndex).limit(itemsPerPage);

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
    // try {
    //     const url = process.env.URL_DB;
    //     await mongoose.connect(url, { family: 4, dbName: 'interiorConstruction' }).then(async () => {
    //         // Iterate over the array of fake accounts and save each to the database
    //         for (let i = 0; i < designData.length; i++) {
    //             try {
    //                 const account = new Design(designData[i]);
    //                 await account.save();
    //                 console.log('ok: ', i);
    //             } catch (error) {
    //                 console.error('client', i, 'error:', error.message);
    //             }
    //         }

    //         console.log('Fake accounts saved to the database!');
    //     })
    // } catch (error) {
    //     console.error(error.message);
    // } finally {
    //     // Close the database connection
    //     mongoose.connection.close();
    // }

    // try {
    //     const url = process.env.URL_DB;
    //     await mongoose.connect(url, { family: 4, dbName: 'interiorConstruction' }).then(async () => {
    //         // Iterate over the array of fake accounts and save each to the database
    //         for (let i = 0; i < furnitureData.length; i++) {
    //             try {
    //                 await Material.find({}).sort({ name: 1 }).skip(startIndex).limit(itemsPerPage).explain('executionStats');
    //                 let data = await Furniture.findOneAndUpdate({ name: furnitureData[i].name }, furnitureData[i]).exec();
    //                 console.log('ok: ', data);
    //             } catch (error) {
    //                 console.error('client', i, 'error:', error.message);
    //             }
    //         }

    //         console.log('Fake accounts saved to the database!');
    //     })
    // } catch (error) {
    //     console.error(error.message);
    // } finally {
    //     // Close the database connection
    //     mongoose.connection.close();
    // }
}

export const colorById = async (id) => {
    if (id) {
        const url = process.env.URL_DB;
        await mongoose.connect(url, { family: 4, dbName: 'interiorConstruction' });
        try {
            const data = await Color.findById(id);
            if (data) {
                return {
                    status: 200,
                    data: data,
                    message: "OK"
                };
            } else {
                return {
                    status: 200,
                    data: {},
                    message: "No data"
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
    } else {
        return {
            status: 400,
            messageError: 'Missing required ID',
        }
    }
}
