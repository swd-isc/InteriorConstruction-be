import Client from "../models/Client";
import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;

exports.getClients = async (mode, pageReq) => {
  try {
    let sortAsc = sortByInput(mode);
    const itemsPerPage = 10;
    // Parse query parameters
    const page = parseInt(pageReq) || 1;
    let data = {};

    // Calculate start and end indices for the current page
    const startIndex = (page - 1) * itemsPerPage;

    // Get the data for the current page
    const url = process.env.URL_DB;
    await mongoose.connect(url, { family: 4, dbName: "interiorConstruction" });

    // Count all documents in the collection
    const totalDocuments = await Client.countDocuments();

    // Calculate total pages
    const totalPages = Math.ceil(totalDocuments / itemsPerPage);

    // data.clients = await Client.find().skip(startIndex).limit(itemsPerPage);

    data.clients = await Client.find()
      .skip(startIndex)
      .limit(itemsPerPage)
      .populate({
        path: "accountId",
        select: "-_id email role password refreshToken", // Select only the fields you need
      })
      .populate({
        path: "contracts",
        select: "-_id designId contractPrice status", // Select the desired fields from the contract document
        populate: {
          path: "designId",
          select: "designName", // Select the desired fields from the design document
        },
      });

    data.page = page;
    data.totalPages = totalPages;

    return {
      status: 200,
      data: data,
      message: data.length !== 0 ? "OK" : "No data",
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      messageError: error,
    };
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
};

exports.getClientById = async (id) => {
  try {
    const url = process.env.URL_DB;
    await mongoose.connect(url, { family: 4, dbName: "interiorConstruction" });

    const data = await Client.findById(id)
      .populate({
        path: "accountId",
        select: "-_id email role password refreshToken", // Select only the fields you need
      })
      .populate({
        path: "contracts",
        select: "-_id designId contractPrice status", // Select the desired fields from the contract document
        populate: {
          path: "designId",
          select: "designName", // Select the desired fields from the design document
        },
      });

    return {
      status: 200,
      data: data,
      message: data.length !== 0 ? "OK" : "No data",
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      messageError: error,
    };
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
};

exports.createClient = async (reqBody) => {
  try {
    let data = [];
    const url = process.env.URL_DB;
    await mongoose.connect(url, { family: 4, dbName: "interiorConstruction" });
    const client = new Client(reqBody);

    try {
      data = await client.save();
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

exports.updateClient = async (clientId, reqBody) => {
  try {
    let data = {};

    const idClientValid = await isIdValid(clientId, "client");

    if (!idClientValid.isValid) {
      return {
        status: idClientValid.status,
        data: {},
        messageError: idClientValid.messageError,
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
      data = await Client.findByIdAndUpdate(clientId, reqBody, {
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

exports.deleteClient = async (clientId) => {
  try {
    let data = {};
    //Validate classificationId
    const idClientValid = await isIdValid(clientId, "client");

    if (!idClientValid.isValid) {
      return {
        status: idClientValid.status,
        data: {},
        messageError: idClientValid.messageError,
      };
    }

    const url = process.env.URL_DB;
    await mongoose.connect(url, { family: 4, dbName: "interiorConstruction" });

    try {
      data = await Client.findOneAndDelete({ _id: new ObjectId(clientId) });
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

function sortByInput(mode) {
  if (!mode) {
    //No input => Ascending
    return 1;
  }
  // Convert input to lowercase and compare
  const lowerCaseInput = mode.toUpperCase();

  if (lowerCaseInput === "DESC") {
    return -1; // Descending
  } else {
    return 1; // Ascending
  }
}

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
      case "client":
        // Check if the classification with the given ObjectId exists in the database
        data = await Client.findById(id);
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
