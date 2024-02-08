import express from "express";
import contractController from "../../controller/contract-controller/ContractController";

const router = express.Router();

const ContractRouter = (app) => {
  router.get("/page/:page", contractController.getContracts);
  router.get("/:id", contractController.getContractById)

  return app.use("/contract", router);
};

export { ContractRouter };
