import Client from "../../models/Client";
import mongoose from "mongoose";

exports.getClients = async (pageReq) => {
  try {
    const itemsPerPage = 10;
    // Parse query parameters
    const page = parseInt(pageReq) || 1;
    let totalClients = 0;
    let currentPageData = [];

    // Calculate start and end indices for the current page
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = page * itemsPerPage;

    const url = process.env.URL_DB;
    await mongoose.connect(url, { family: 4, dbName: "interiorConstruction" });

    totalClients = await Client.countDocuments();

    if (totalClients > 0) {
      currentPageData = await Client.find({}).skip(startIndex).limit(endIndex);
    }

    return {
      data: currentPageData,
      pagination: {
        page: page,
        itemsPerPage: itemsPerPage,
        totalItems: totalClients,
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

exports.getClientById = async (id) => {
  try {
    const url = process.env.URL_DB;
    await mongoose.connect(url, { family: 4, dbName: "interiorConstruction" });
    console.log(id);
    const data = await Client.findById(id);
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
