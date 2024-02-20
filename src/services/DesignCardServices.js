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

exports.updateDesignCard = async (designCardId, reqBody) => {
  try {
    let data = {};

    const idDesignValid = await isIdValid(designCardId, "design_card");

    if (!idDesignValid.isValid) {
      return {
        status: idDesignValid.status,
        data: {},
        messageError: idDesignValid.messageError,
      };
    }

    if (!reqBody) {
      return {
        status: 400,
        data: {},
        messageError: "Required body",
      };
    }

    const url = process.env.URL_DB;
    await mongoose.connect(url, { family: 4, dbName: "interiorConstruction" });

    try {
      data = await DesignCard.findByIdAndUpdate(designCardId, reqBody, {
        runValidators: true,
        new: true,
      });
    } catch (error) {
      return {
        status: 400,
        data: {},
        messageError: error.message,
      };
    }

    return {
      status: 200,
      data: data !== null ? data : {},
      message: data !== null ? "OK" : "No data",
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

async function isIdValid(id, model) {
  if (id === null || id === undefined) {
    return {
      status: 400,
      isValid: false,
      messageError: `ObjectId ${model} required.`,
    };
  }
  try {
    const url = process.env.URL_DB;
    await mongoose.connect(url, { family: 4, dbName: "interiorConstruction" });

    const isValidObjectId = mongoose.Types.ObjectId.isValid(id);

    if (!isValidObjectId) {
      // The provided id is not a valid ObjectId
      return {
        status: 400,
        isValid: false,
        messageError: `Not a valid ${model} ObjectId.`,
      };
    }

    let data = null;

    switch (model) {
      case "design_card":
        // Check if the classification with the given ObjectId exists in the database
        data = await DesignCard.findById(id);
        break;
      default:
        break;
    }

    if (data !== null) {
      return {
        isValid: true,
      };
    } else {
      return {
        status: 400,
        isValid: false,
        messageError: "ObjectId not found.",
      };
    }
    return data !== null; // Returns true if data exists, false otherwise
  } catch (error) {
    console.error("Error checking ObjectId:", error);
    return {
      status: 500,
      isValid: false,
      messageError: error,
    };
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
}
