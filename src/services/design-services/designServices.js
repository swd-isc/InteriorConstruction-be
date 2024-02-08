import Design from "../../models/Design";
import mongoose from "mongoose";

exports.getDesigns = async (pageReq) => {
  try {
    const itemsPerPage = 10;
    // Parse query parameters
    const page = parseInt(pageReq) || 1;
    let totalDesigns = 0;
    let currentPageData = [];

    // Calculate start and end indices for the current page
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = page * itemsPerPage;

    const url = process.env.URL_DB;
    await mongoose.connect(url, { family: 4, dbName: "interiorConstruction" });

    totalDesigns = await Design.countDocuments();

    if (totalDesigns > 0) {
      currentPageData = await Design.find({}).skip(startIndex).limit(endIndex);
    }

    return {
      data: currentPageData,
      pagination: {
        page: page,
        itemsPerPage: itemsPerPage,
        totalItems: totalDesigns,
      },
    };
  } catch (error) {
    console.error(error.message);
    return {
      error: error,
    };
  } finally {
    mongoose.connection.close();
  }
};

exports.getDesignById = async (id) => {
  try {
    const url = process.env.URL_DB;
    await mongoose.connect(url, { family: 4, dbName: "interiorConstruction" });
    console.log(id);
    const data = await Design.findById(id);
    return { data: data };
  } catch (error) {
    console.error(error.message);
    return {
      error: error,
    };
  } finally {
    mongoose.connection.close();
  }
};
