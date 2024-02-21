import express from "express";
import { contractService } from "../controller/ContractController";

const router = express.Router();

const ContractRouter = (app) => {
  router.get("/", contractService.getContracts);
  router.get("/:id", contractService.getContractById);

  router.post("/", contractService.createContract);

  router.put("/:id", contractService.updateContract);
  router.put("/", contractService.updateContract);

  router.delete("/:id", contractService.deleteContract);
  router.delete("/", contractService.deleteContract);

  return app.use("/api/contract", router);
};

export { ContractRouter };
