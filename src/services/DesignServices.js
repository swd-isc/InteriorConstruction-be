import Design from "../models/Design";
import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;

exports.getDesigns = async (mode, pageReq) => {
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
    const totalDocuments = await Design.countDocuments({ type: "DEFAULT" });

    // Calculate total pages
    const totalPages = Math.ceil(totalDocuments / itemsPerPage);

    data.designs = await Design.aggregate([
      {
        $match: {
          type: "DEFAULT",
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
      status: 500,
      messageError: error,
    };
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
};

exports.getDesignById = async (id) => {
  try {
    const url = process.env.URL_DB;
    await mongoose.connect(url, { family: 4, dbName: "interiorConstruction" });

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
