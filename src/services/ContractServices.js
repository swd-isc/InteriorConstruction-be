import Contract from "../models/Contract";
import Client from "../models/Client";
import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;

export const contractRepository = {
  getContracts: async (mode, pageReq, clientId) => {
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
      await mongoose.connect(url, {
        family: 4,
        dbName: "interiorConstruction",
      });

      // Count all documents in the collection
      const totalDocuments = await Contract.countDocuments();

      // Calculate total pages
      const totalPages = Math.ceil(totalDocuments / itemsPerPage);

      const idClientValid = await isIdValid(id, "client");

      if (!idClientValid.isValid) {
        data.contracts = await Contract.find()
          .sort({ price: sortAsc })
          .skip(startIndex)
          .limit(itemsPerPage);
      } else {
        data.contracts = await Contract.find()
          .sort({ price: sortAsc, clientId: clientId })
          .skip(startIndex)
          .limit(itemsPerPage);
      }

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
  },

  getContractById: async (id) => {
    try {
      const idContractValid = await isIdValid(id, "contract");

      if (!idContractValid.isValid) {
        return {
          status: idContractValid.status,
          data: {},
          messageError: idContractValid.messageError,
        };
      }

      const url = process.env.URL_DB;
      await mongoose.connect(url, {
        family: 4,
        dbName: "interiorConstruction",
      });

      const data = await Contract.findById(id);

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
  },

  createContract: async (reqBody) => {
    try {
      let data = [];
      const url = process.env.URL_DB;
      await mongoose.connect(url, {
        family: 4,
        dbName: "interiorConstruction",
      });
      reqBody.status = "PROCESSING";
      const contract = new Contract(reqBody);

      try {
        data = await contract.save();

        // Retrieve the client using the client ID from the contract request body
        const client = await Client.findById(reqBody.clientId);

        // Update the client's contracts array with the ID of the newly created contract
        client.contracts.push(data._id);

        // Save the updated client
        await client.save();
      } catch (error) {
        return {
          status: 400,
          data: {},
          messageError: error.message,
        };
      }

      return {
        status: 201,
        data: data,
        message: data.length !== 0 ? "OK" : "No data",
      };
    } catch (error) {
      console.error("error ne", error);
      return {
        status: 500,
        messageError: error.toString(),
      };
    } finally {
      // Close the database connection
      mongoose.connection.close();
    }
  },

  updateContract: async (contractId, reqBody) => {
    try {
      let data = {};

      const idContractValid = await isIdValid(contractId, "contract");

      if (!idContractValid.isValid) {
        return {
          status: idContractValid.status,
          data: {},
          messageError: idContractValid.messageError,
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
      await mongoose.connect(url, {
        family: 4,
        dbName: "interiorConstruction",
      });

      try {
        const contract = await Contract.findById(contractId);

        if (reqBody.contractPrice) contract.contractPrice = reqBody.contractPrice;
        if (reqBody.status) contract.status = reqBody.status;
        if (reqBody.contractFileURL) contract.contractFileURL = reqBody.contractFileURL;

        data = await contract.save();

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
  },

  deleteContract: async (contractId) => {
    try {
      let data = {};
      //Validate classificationId
      const idContractValid = await isIdValid(contractId, "contract");

      if (!idContractValid.isValid) {
        return {
          status: idContractValid.status,
          data: {},
          messageError: idContractValid.messageError,
        };
      }

      const url = process.env.URL_DB;
      await mongoose.connect(url, {
        family: 4,
        dbName: "interiorConstruction",
      });

      try {
        data = await Contract.findOneAndDelete({
          _id: new ObjectId(contractId),
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
  },
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
    await mongoose.connect(url, {
      family: 4,
      dbName: "interiorConstruction",
    });

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
      case "contract":
        // Check if the classification with the given ObjectId exists in the database
        data = await Contract.findById(id);
        break;
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
