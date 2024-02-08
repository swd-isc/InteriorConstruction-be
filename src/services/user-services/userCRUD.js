import Account from '../../models/Account';
import { accountData } from "../../sample-data/AccountData";
import Client from '../../models/Client';
import { clientData } from "../../sample-data/ClientData";
import Material from '../../models/Material';
import { materialData } from '../../sample-data/MaterialData';
import Color from '../../models/Color';
import { colorData } from '../../sample-data/ColorData';
import Classification from '../../models/Classification';
import { classificationData } from '../../sample-data/ClassificationData';
import Furniture from '../../models/Furniture';
import { furnitureData } from '../../sample-data/FurnitureData';
import Design from '../../models/Design';
import { designData } from '../../sample-data/DesignData';
import Contract from '../../models/Contract';
import { contractData } from '../../sample-data/ContractData';

import mongoose from "mongoose";

export const getUserData = async () => {
    // try {
    //     const url = process.env.URL_DB;
    //     await mongoose.connect(url, { family: 4, dbName: 'interiorConstruction' }).then(async () => {
    //         // Iterate over the array of fake accounts and save each to the database
    //         for (let i = 0; i < contractData.length; i++) {
    //             try {
    //                 const account = new Contract(contractData[i]);
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
    return {
        name: "Tuan Kiet",
        age: 21,
        sex: "Male",
    }
}