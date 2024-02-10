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
    if (totalAccounts > 0)
      currentPageData = await Account.find({}).skip(startIndex).limit(endIndex);

    if (totalAccounts >= 0) {
      return {
        data: currentPageData,
        pagination: {
          page: page,
          totalItems: totalAccounts,
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

exports.getAccountById = async (id) => {
  try {
    const url = process.env.URL_DB;
    await mongoose.connect(url, { family: 4, dbName: "interiorConstruction" });
    const data = await Account.findById(id);
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

exports.createAccount = async (account) => {
  try {
    const url = process.env.URL_DB;
    await mongoose.connect(url, { family: 4, dbName: "interiorConstruction" });

    console.log("account: ", account);
    const data = new Account(account);
    const validationError = data.validateSync();

    if (validationError) {
      let error = {};

      if (validationError.errors["email"]?.message)
        error.errMail = validationError.errors["email"]?.message;

      if (validationError.errors["password"]?.message)
        error.errPassword = validationError.errors["password"]?.message;

      if (validationError.errors["role"]?.message)
        error.errRole = validationError.errors["role"]?.message;

      if (validationError.errors["logInMethod"]?.message)
        error.errLoginMethod = validationError.errors["logInMethod"]?.message;

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
