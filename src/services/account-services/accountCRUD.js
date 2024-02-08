import Account from "../../models/Account";
import mongoose from "mongoose";

exports.getAccounts = async () => {
  try {
    const url = process.env.URL_DB;
    await mongoose.connect(url, { family: 4, dbName: "interiorConstruction" });

    const accounts = await Account.find();
    return accounts;
  } catch (error) {
    console.error(error.message);
  } finally {
    mongoose.connection.close();
  }
};

exports.getAccountById = async (id) => {
  try {
    const url = process.env.URL_DB;
    await mongoose.connect(url, { family: 4, dbName: "interiorConstruction" });
    console.log(id)
    const account = await Account.findById(id);
    return account;
  } catch (error) {
    console.error(error.message);
  } finally {
    mongoose.connection.close();
  }
};
