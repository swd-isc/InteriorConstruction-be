import express from "express";
import accountService from "../controller/AccountController";

const router = express.Router();

const AccountRouter = (app) => {
  // router.get("/insert-sample-data", accountService.insertSampleData);

  router.get("/", accountService.getAccounts);
  router.get("/:id", accountService.getAccountById);

  router.post("/", accountService.createAccount);

  router.put("/:id", accountService.updateAccount);
  router.put("/", accountService.updateAccount);

  router.delete("/:id", accountService.deleteAccount);
  router.delete("/", accountService.deleteAccount);

  return app.use("/api/account", router);
};

export { AccountRouter };
