import express from "express";
import accountService from "../../controller/account-controller/AccountController";

const router = express.Router();

const AccountRouter = (app) => {
  router.get("/page/:page", accountService.getAccounts);
  router.get("/:id", accountService.getAccountById);

  router.post("/", accountService.createAccount);

  return app.use("/account", router);
};

export { AccountRouter };
