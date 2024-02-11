import Color from '../models/Color';
import Delivery from '../models/Delivery';

import mongoose from "mongoose";
import { returnPolicyData } from '../sample-data/ReturnPolicyData';
import { deliveryData } from '../sample-data/DeliveryData';

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
            return {
                data: currentPageData,
                pagination: {
                    page: page,
                    totalItems: totalColors,
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
    // try {
    //     const url = process.env.URL_DB;
    //     await mongoose.connect(url, { family: 4, dbName: 'interiorConstruction' }).then(async () => {
    //         // Iterate over the array of fake accounts and save each to the database
    //         for (let i = 0; i < deliveryData.length; i++) {
    //             try {
    //                 const account = new Delivery(deliveryData[i]);
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
    //         for (let i = 0; i < clientData.length; i++) {
    //             try {
    //                 let data = await Client.findOneAndUpdate({ firstName: clientData[i].firstName, lastName: clientData[i].lastName }, { contracts: clientData[i].contracts }).exec();
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