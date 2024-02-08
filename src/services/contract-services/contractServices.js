import Contract from "../../models/Contract";
import mongoose from "mongoose";

exports.getContracts = async (pageReq) => {
  try {
    const itemsPerPage = 10;
    // Parse query parameters
    const page = parseInt(pageReq) || 1;
    let totalContracts = 0;
    let currentPageData = [];

    // Calculate start and end indices for the current page
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = page * itemsPerPage;

    const url = process.env.URL_DB;
    await mongoose.connect(url, { family: 4, dbName: "interiorConstruction" });

    totalContracts = await Contract.countDocuments();

    if (totalContracts > 0) {
      currentPageData = await Contract.find({}).skip(startIndex).limit(endIndex);
    }

    return {
      data: currentPageData,
      pagination: {
        page: page,
        itemsPerPage: itemsPerPage,
        totalItems: totalContracts,
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

exports.getContractById = async (id) => {
  try {
    const url = process.env.URL_DB;
    await mongoose.connect(url, { family: 4, dbName: "interiorConstruction" });
    console.log(id);
    const data = await Contract.findById(id);
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
