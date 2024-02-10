import express from "express";
import contractService from "../controller/ContractController";

const router = express.Router();

const ContractRouter = (app) => {
  router.get("/page/:page", contractService.getContracts);
  router.get("/:id", contractService.getContractById)

  return app.use("/contract", router);
};

export { ContractRouter };
