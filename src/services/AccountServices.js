import Account from "../models/Account";
import mongoose from "mongoose";

import DesignCard from "../models/DesignCard";
import Design from "../models/Design";
import designCardData from "../sample-data/DesignCardData";

exports.insertSampleData = async () => {
  try {
    const url = process.env.URL_DB;
    await mongoose.connect(url, { family: 4, dbName: "interiorConstruction" });

    const designs = await Design.find({});
    const designcards = await DesignCard.find({});

    // for (let i = 0; i < 43; i++) {
    //   designs[i].designCard = designcards[i]._id;
    //   await designs[i].save();
    // }

    return { data: "done" };
  } catch (error) {
    console.error(error.message);
    return {
      status: 500,
      error: error,
    };
  } finally {
    mongoose.connection.close();
  }
};

exports.getAccounts = async (mode, pageReq) => {
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
    const totalDocuments = await Account.countDocuments({
      logInMethod: "DEFAULT",
    });

    // Calculate total pages
    const totalPages = Math.ceil(totalDocuments / itemsPerPage);

    data.accounts = await Account.find({ logInMethod: "DEFAULT" })
      .sort({ email: sortAsc })
      .skip(startIndex)
      .limit(itemsPerPage);

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

exports.getAccountById = async (id) => {
  try {
    const url = process.env.URL_DB;
    await mongoose.connect(url, { family: 4, dbName: "interiorConstruction" });

    const data = await Account.findById(id);

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

exports.createAccount = async (reqBody) => {
  try {
    let data = [];
    const url = process.env.URL_DB;
    await mongoose.connect(url, { family: 4, dbName: "interiorConstruction" });
    const account = new Account(reqBody);

    try {
      data = await account.save();
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

exports.updateAccount = async (accountId, reqBody) => {
  try {
    let data = {};

    const idAccountValid = await isIdValid(accountId, "account");

    if (!idAccountValid.isValid) {
      return {
        status: idAccountValid.status,
        data: {},
        messageError: idAccountValid.messageError,
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
      data = await Account.findByIdAndUpdate(accountId, reqBody, {
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
      case "account":
        // Check if the classification with the given ObjectId exists in the database
        data = await Account.findById(id);
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
