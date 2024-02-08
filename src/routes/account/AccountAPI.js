import express from "express";
import accountController from "../../controller/account-controller/AccountController";

const router = express.Router();

const AccountRouter = (app) => {
  router.get("/page/:page", accountController.getAccounts);
  router.get("/:id", accountController.getAccountById)

  return app.use("/account", router);
};

export { AccountRouter };
