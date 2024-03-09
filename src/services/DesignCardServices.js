import mongoose from "mongoose";
import DesignCard from "../models/DesignCard";
import Design from "../models/Design";

const ObjectId = mongoose.Types.ObjectId;

export const designCardRepository = {
  getDesignCards: async (mode, pageReq) => {
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
      const totalDocuments = await DesignCard.countDocuments();

      // Calculate total pages
      const totalPages = Math.ceil(totalDocuments / itemsPerPage);

      data.designCards = await DesignCard.find()
        .sort({ title: sortAsc })
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
  },

  getDesignCardById: async (id) => {
    try {
      const idDeisgnCardValid = await isIdValid(id, "design-card");

      if (!idDeisgnCardValid.isValid) {
        return {
          status: idDeisgnCardValid.status,
          data: {},
          messageError: idDeisgnCardValid.messageError,
        };
      }

      const url = process.env.URL_DB;
      await mongoose.connect(url, {
        family: 4,
        dbName: "interiorConstruction",
      });

      const data = await DesignCard.findById(id);

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

  createDesignCard: async (reqBody) => {
    try {
      let data = [];
      const url = process.env.URL_DB;
      await mongoose.connect(url, {
        family: 4,
        dbName: "interiorConstruction",
      });
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

  updateDesignCard: async (designCardId, reqBody) => {
    try {
      let data = {};

      const idDesignValid = await isIdValid(designCardId, "design-card");

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
  },

  deleteDesignCard: async (designCardId) => {
    try {
      let data = {};
      //Validate classificationId
      const idDesignCardValid = await isIdValid(designCardId, "design-card");

      if (!idDesignCardValid.isValid) {
        return {
          status: idDesignCardValid.status,
          data: {},
          messageError: idDesignCardValid.messageError,
        };
      }

      const url = process.env.URL_DB;
      await mongoose.connect(url, {
        family: 4,
        dbName: "interiorConstruction",
      });

      try {
        const designWithDesignCard = await Design.findOne({
          designCard: designCardId,
        });
        if (designWithDesignCard) {
          return {
            status: 400,
            data: {},
            messageError:
              "Cannot delete design card because it is referenced by one or more designs.",
          };
        }

        data = await DesignCard.findOneAndDelete({
          _id: new ObjectId(designCardId),
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
      case "design-card":
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
