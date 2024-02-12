import mongoose from 'mongoose';
import ReturnPolicy from '../models/ReturnPolicy';

export const returnPolicyById = async (id) => {
    if (id) {
        const url = process.env.URL_DB;
        await mongoose.connect(url, { family: 4, dbName: 'interiorConstruction' });
        try {
            const data = await ReturnPolicy.findById(id);
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
