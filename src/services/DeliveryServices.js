import mongoose from 'mongoose';
import Delivery from '../models/Delivery';

export const deliveryById = async (id) => {
    if (id) {
        const url = process.env.URL_DB;
        await mongoose.connect(url, { family: 4, dbName: 'interiorConstruction' });
        try {
            const data = await Delivery.findById(id);
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
