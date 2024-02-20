import mongoose from "mongoose";
import DesignCard from "../models/DesignCard";

// export const designCardById = async (id) => {
//     if (id) {
//         const url = process.env.URL_DB;
//         await mongoose.connect(url, { family: 4, dbName: 'interiorConstruction' });
//         try {
//             const data = await DesignCard.findById(id);
//             if (data) {
//                 return {
//                     status: 200,
//                     data: data,
//                     message: "OK"
//                 };
//             } else {
//                 return {
//                     status: 200,
//                     data: {},
//                     message: "No data"
//                 }
//             }
//         } catch (error) {
//             return {
//                 status: 500,
//                 messageError: error,
//             }
//         } finally {
//             // Close the database connection
//             mongoose.connection.close();
//         }
//     } else {
//         return {
//             status: 400,
//             messageError: 'Missing required ID',
//         }
//     }
// }

exports.createDesignCard = async (reqBody) => {
  try {
    let data = [];
    const url = process.env.URL_DB;
    await mongoose.connect(url, { family: 4, dbName: "interiorConstruction" });
    const designCard = new DesignCard(reqBody);

    try {
      data = await designCard.save();
    } catch (error) {
      return {
        status: 400,
        data: {},
        messageError: error.message,
      };
    }

    return {
      status: 200,
      data: data,
      message: data.length !== 0 ? "OK" : "No data",
    };
  } catch (error) {
    console.error("error ne", error);
    return {
      status: 500,
      messageError: error,
    };
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
};
