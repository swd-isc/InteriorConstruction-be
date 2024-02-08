import express from "express";
import accountController from "../../controller/account-controller/AccountController";

const router = express.Router();

const AccountRouter = (app) => {
  router.get("/", accountController.getAccounts);
  router.get("/:iddd", accountController.getAccountById)

  return app.use("/account", router);
};

export { AccountRouter };
