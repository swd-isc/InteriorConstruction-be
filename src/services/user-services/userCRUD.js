import { accountData } from "../../sample-data/AccountData";
import Account from '../../models/Account'
import Client from '../../models/Client'
import mongoose from "mongoose";
import { clientData } from "../../sample-data/ClientData";

export const getUserData = async () => {
    // try {
    //     const url = process.env.URL_DB;
    //     await mongoose.connect(url, { family: 4, dbName: 'interiorConstruction' }).then(async () => {
    //         // Iterate over the array of fake accounts and save each to the database
    //         for (let i = 0; i < clientData.length; i++) {
    //             const account = new Client(clientData[i]);
    //             await account.save();
    //             console.log('ok: ', i);
    //         }

    //         console.log('Fake accounts saved to the database!');
    //     })
    // } catch (error) {
    //     console.error('Error saving fake accounts:', error.message);
    // } finally {
    //     // Close the database connection
    //     mongoose.connection.close();
    // }
    return {
        name: "Tuan Kiet",
        age: 21,
        sex: "Male",
    }
}