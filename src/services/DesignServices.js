import Design from "../models/Design";
import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;

export const designRepository = {
  getDesigns: async (mode, pageReq, designType) => {
    try {
      let sortAsc = sortByInput(mode);
      const itemsPerPage = 10;
      // Parse query parameters
      const page = parseInt(pageReq) || 1;
      let data = {};

      // Calculate start and end indices for the current page
      const startIndex = (page - 1) * itemsPerPage;

      // Check if designType is undefined or null, and convert to uppercase
      if (designType !== undefined && designType !== null) {
        designType = designType.toUpperCase();

        // Validate designType
        if (designType === "DEFAULT" || designType === "CUSTOM") {
          // Valid input, proceed with your logic
          console.log("Design type is valid:", designType);
        } else {
          // Invalid input, set to DEFAULT and log a message
          designType = "DEFAULT";
          console.warn("Invalid design type. Setting to DEFAULT.");
        }
      } else {
        designType = "DEFAULT";
      }

      // Get the data for the current page
      const url = process.env.URL_DB;
      await mongoose.connect(url, {
        family: 4,
        dbName: "interiorConstruction",
      });

      // Count all documents in the collection
      const totalDocuments = await Design.countDocuments({ type: designType });

      // Calculate total pages
      const totalPages = Math.ceil(totalDocuments / itemsPerPage);

      data.designs = await Design.aggregate([
        {
          $match: {
            type: designType,
          },
        },
        {
          $sort: {
            designPrice: sortAsc,
          },
        },
        {
          $skip: startIndex, // Skip documents based on the startIndex
        },
        {
          $limit: itemsPerPage, // Limit the number of documents per page
        },
        {
          $lookup: {
            from: "classification",
            localField: "classifications",
            foreignField: "_id",
            as: "classifications",
          },
        },
        {
          $project: {
            _id: 1,
            designName: 1,
            description: 1,
            designURL: 1,
            classifications: {
              $map: {
                input: {
                  $filter: {
                    input: "$classifications",
                    as: "classification",
                    cond: { $eq: ["$$classification.type", "STYLE"] },
                  },
                },
                as: "classification",
                in: "$$classification.classificationName",
              },
            },
          },
        },
      ]);

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
        status: 400,
        messageError: error.toString(),
      };
    } finally {
      // Close the database connection
      mongoose.connection.close();
    }
  },

  getDesignById: async (id) => {
    try {
      const idDesignValid = await isIdValid(id, "design");

      if (!idDesignValid.isValid) {
        return {
          status: idDesignValid.status,
          data: {},
          messageError: idDesignValid.messageError,
        };
      }

      const url = process.env.URL_DB;
      await mongoose.connect(url, {
        family: 4,
        dbName: "interiorConstruction",
      });

      const data = await Design.aggregate([
        {
          $match: {
            _id: new ObjectId(id), // Match the document by its _id
          },
        },
        {
          $lookup: {
            from: "furniture",
            localField: "furnitures",
            foreignField: "_id",
            as: "furnitures",
          },
        },
        {
          $addFields: {
            furnitures: {
              $map: {
                input: "$furnitures",
                as: "furniture",
                in: {
                  _id: "$$furniture._id",
                  name: "$$furniture.name",
                  imgURL: "$$furniture.imgURL",
                  price: "$$furniture.price",
                },
              },
            },
          },
        },
        {
          $lookup: {
            from: "design_card", // The collection to perform the lookup on
            localField: "designCard", // The field in the Design collection
            foreignField: "_id", // The field in the DesignCard collection
            as: "designCard", // The name of the field to add to the Design document
          },
        },
        {
          $addFields: {
            designCard: { $arrayElemAt: ["$designCard", 0] }, // Convert designCard array to object
          },
        },
        {
          $project: {
            classifications: 0,
            type: 0,
          },
        },
      ]);

      return {
        status: 200,
        data: data[0],
        message: data.length !== 0 ? "OK" : "No data",
      };
    } catch (error) {
      console.error(error);
      return {
        status: 500,
        messageError: error.toString(),
      };
    } finally {
      // Close the database connection
      mongoose.connection.close();
    }
  },

  createDesign: async (reqBody) => {
    try {
      let data = [];
      const url = process.env.URL_DB;
      await mongoose.connect(url, {
        family: 4,
        dbName: "interiorConstruction",
      });
      const design = new Design(reqBody);

      try {
        data = await design.save();
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

  updateDesign: async (designId, reqBody) => {
    try {
        let data = {};

        const idDesignValid = await isIdValid(designId, "design");

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
        await mongoose.connect(url, {
            family: 4,
            dbName: "interiorConstruction",
        });

        let design = await Design.findById(designId);

        if (!design) {
            return {
                status: 404,
                data: {},
                messageError: "Design not found",
            };
        }

        // Iterate through req.body and set corresponding fields in the design object
        for (const key in reqBody) {
            if (reqBody.hasOwnProperty(key)) {
                design[key] = reqBody[key];
            }
        }

        try {
            // Validate the updated design object
            await design.validate();

            // Save the updated design
            data = await design.save();
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

  deleteDesign: async (designId) => {
    try {
      let data = {};
      //Validate classificationId
      const idDesignValid = await isIdValid(designId, "design");

      if (!idDesignValid.isValid) {
        return {
          status: idDesignValid.status,
          data: {},
          messageError: idDesignValid.messageError,
        };
      }

      const url = process.env.URL_DB;
      await mongoose.connect(url, {
        family: 4,
        dbName: "interiorConstruction",
      });

      try {
        data = await Design.findOneAndDelete({
          _id: new ObjectId(designId),
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
      case "design":
        // Check if the classification with the given ObjectId exists in the database
        data = await Design.findById(id);
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
