import Account from "../../models/Account";
import mongoose from "mongoose";

exports.getAccounts = async (pageReq) => {
  try {
    const itemsPerPage = 10;
    // Parse query parameters
    const page = parseInt(pageReq) || 1;
    let totalAccounts = 0;
    let currentPageData = [];

    // Calculate start and end indices for the current page
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = page * itemsPerPage;

    const url = process.env.URL_DB;
    await mongoose.connect(url, { family: 4, dbName: "interiorConstruction" });

    totalAccounts = await Account.countDocuments();

    if (totalAccounts > 0) {
      currentPageData = await Account.find({}).skip(startIndex).limit(endIndex);
    }

    return {
      data: currentPageData,
      pagination: {
        page: page,
        itemsPerPage: itemsPerPage,
        totalItems: totalAccounts,
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

exports.getAccountById = async (id) => {
  try {
    const url = process.env.URL_DB;
    await mongoose.connect(url, { family: 4, dbName: "interiorConstruction" });
    console.log(id);
    const data = await Account.findById(id);
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
