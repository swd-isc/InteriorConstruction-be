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
    if (totalClients > 0)
      currentPageData = await Client.find({}).skip(startIndex).limit(endIndex);

    if (totalClients >= 0) {
      return {
        data: currentPageData,
        pagination: {
          page: page,
          totalItems: totalClients,
        },
      };
    } else {
      return {
        status: 400,
        error: "No data",
      };
    }
  } catch (error) {
    console.error(error);
    return {
      status: 500,
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
    const data = await Client.findById(id);
    return { data: data };
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

exports.createClient = async (client) => {
  try {
    const url = process.env.URL_DB;
    await mongoose.connect(url, { family: 4, dbName: "interiorConstruction" });

    console.log("client: ", client);
    const data = new Client(client);
    const validationError = data.validateSync();

    if (validationError) {
      let error = {};

      if (validationError.errors["firstName"]?.message)
        error.errFirstName = validationError.errors["firstName"]?.message;

      if (validationError.errors["lastName"]?.message)
        error.errLastName = validationError.errors["lastName"]?.message;

      if (validationError.errors["birthDate"]?.message)
        error.errBirthDate = validationError.errors["birthDate"]?.message;

      if (validationError.errors["phone"]?.message)
        error.errPhone = validationError.errors["phone"]?.message;

      if (validationError.errors["photoURL"]?.message)
        error.errPhotoURL = validationError.errors["photoURL"]?.message;

      if (validationError.errors["accountId"]?.message)
        error.errAccountId = validationError.errors["accountId"]?.message;

      if (validationError.errors["contracts"]?.message)
        error.errContracts = validationError.errors["contracts"]?.message;

      return {
        status: 400,
        error: error,
      };
    } else {
      console.log("ko loi");
      try {
        await data.save();
        return {
          status: 200,
          data: data,
        };
      } catch (error) {
        console.log("check err: ", error.message);
        return {
          status: 400,
          error: error.message,
        };
      }
    }
  } catch (error) {
    console.error(error.message);
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
};
