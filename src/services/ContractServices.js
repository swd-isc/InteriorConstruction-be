import Contract from "../models/Contract";
import Client from "../models/Client";
import Request from "../models/Request";
import Furniture from "../models/Furniture";
import Design from "../models/Design";
import mongoose from "mongoose";
import moment from "moment";
import { paymentService } from "./PaymentServices";
import { requestRepository } from "./RequestServices";

const ObjectId = mongoose.Types.ObjectId;

export const contractRepository = {
  // getContracts: async (mode, pageReq, clientId) => {
  //   try {
  //     let sortAsc = sortByInput(mode);
  //     const itemsPerPage = 10;
  //     // Parse query parameters
  //     const page = parseInt(pageReq) || 1;
  //     let data = {};

  //     // Calculate start and end indices for the current page
  //     const startIndex = (page - 1) * itemsPerPage;

  //     const idClientValid = await isIdValid(clientId, "client");

  //     // Get the data for the current page
  //     const url = process.env.URL_DB;
  //     await mongoose.connect(url, {
  //       family: 4,
  //       dbName: "interiorConstruction",
  //     });

  //     // Count all documents in the collection
  //     const totalDocuments = await Contract.countDocuments();

  //     // Calculate total pages
  //     const totalPages = Math.ceil(totalDocuments / itemsPerPage);

  //     if (!idClientValid.isValid) {
  //       data.contracts = await Contract.find()
  //         .sort({ price: sortAsc })
  //         .skip(startIndex)
  //         .limit(itemsPerPage);
  //     } else {
  //       data.contracts = await Contract.find({ clientId: clientId })
  //         .sort({ price: sortAsc })
  //         .skip(startIndex)
  //         .limit(itemsPerPage);
  //     }

  //     data.page = page;
  //     data.totalPages = totalPages;

  //     return {
  //       status: 200,
  //       data: data,
  //       message: data.length !== 0 ? "OK" : "No data",
  //     };
  //   } catch (error) {
  //     console.error(error);
  //     return {
  //       status: 500,
  //       messageError: error,
  //     };
  //   } finally {
  //     // Close the database connection
  //     mongoose.connection.close();
  //   }
  // },

  getContracts: async () => {
    try {
      const url = process.env.URL_DB;
      await mongoose.connect(url, {
        family: 4,
        dbName: "interiorConstruction",
      });

      const data = await Contract.find(
        {},
        {
          "furnitures._id": 0,
          "designs._id": 0,
          "designs.furnitures._id": 0,
        }
      );
      data.reverse();

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

  getContractsByClientId: async (user) => {
    try {
      const url = process.env.URL_DB;
      await mongoose.connect(url, {
        family: 4,
        dbName: "interiorConstruction",
      });

      const data = await Contract.find(
        { "client.clientId": user._id },
        {
          "furnitures._id": 0,
          "designs._id": 0,
          "designs.furnitures._id": 0,
        }
      );
      data.reverse();

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

      const data = await Contract.findById(id, {
        "furnitures._id": 0,
        "designs._id": 0,
        "designs.furnitures._id": 0,
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
  },

  createContract: async (reqBody) => {
    try {
      let data = [];
      const url = process.env.URL_DB;
      await mongoose.connect(url, {
        family: 4,
        dbName: "interiorConstruction",
      });

      let createObj = {};

      //client
      const clientId = reqBody.clientId;
      const client = await Client.findById(clientId);
      createObj.client = {
        clientId: new ObjectId(clientId),
        firstName: client.firstName,
        lastName: client.lastName,
      };

      //furnitures
      if (reqBody.furnitures && reqBody.furnitures.length != 0) {
        const furnitures = [];
        const reqFurs = reqBody.furnitures;

        for (let i = 0; i < reqFurs.length; i++) {
          const curFur = await Furniture.findById(reqFurs[i].furnitureId);

          furnitures.push({
            furnitureId: curFur._id,
            quantity: reqFurs[i].quantity,
            name: curFur.name,
          });
        }

        createObj.furnitures = furnitures;
      }

      //designs
      if (reqBody.designs && reqBody.designs.length != 0) {
        const designs = [];
        const reqDes = reqBody.designs;

        for (let i = 0; i < reqDes.length; i++) {
          const curDes = await Design.findById(reqDes[i].designId).populate(
            "furnitures"
          );
          const curFurs = curDes.furnitures.map((furniture) => {
            return {
              furnitureId: furniture._id,
              name: furniture.name,
            };
          });

          designs.push({
            designId: curDes._id,
            quantity: reqDes[i].quantity,
            designName: curDes.designName,
            furnitures: curFurs,
          });
        }

        createObj.designs = designs;
      }

      //status
      createObj.status = "UNPAID";

      //price
      createObj.contractPrice = reqBody.contractPrice;

      //date
      // createObj.date = moment().format("DD/MM/YYYY HH:mm:ss").toString();
      const date = new Date();
      const timezoneOffsetMinutes = 7 * 60; // UTC+7
      const adjustedDate = new Date(
        date.getTime() + timezoneOffsetMinutes * 60000
      );
      const createDate = moment(adjustedDate).format("DD/MM/YYYY HH:mm:ss");

      createObj.date = createDate;

      const contract = new Contract(createObj);


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

  updateContract: async (contractId, reqBody, user) => {
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
        const contract = await Contract.findById(contractId).populate(
          "orderId"
        );
        const oldStatus = contract.status;
        if (reqBody.status) contract.status = reqBody.status;

        if (
          user.accountId.role == "ADMIN" &&
          reqBody.status == "CANCEL" &&
          oldStatus != "UNPAID"
        ) {
          const order = contract.orderId;
          const res = await paymentService.refund({
            body: {
              vnp_TxnRef: order.vnp_TxnRef,
              transDate: order.vnp_PayDate,
              amount: order.vnp_Amount,
              transType: "02",
              user: "ADMIN",
              contractId: contract._id,
            },
          });
          if (res.status == 400) {
            return res;
          } else {
            const url = process.env.URL_DB;
            await mongoose.connect(url, {
              family: 4,
              dbName: "interiorConstruction",
            });

            const request = await Request.find({ contractId: contract._id });
            if (request.length != 0) {
              request[0].status = "ACCEPT";
              await request[0].save();
            }
          }
        }

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
