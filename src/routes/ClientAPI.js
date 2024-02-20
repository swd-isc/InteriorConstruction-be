import express from "express";
import clientService from "../controller/ClientController";

const router = express.Router();

const ClientRouter = (app) => {
  router.get("/", clientService.getClients);
  router.get("/:id", clientService.getClientById);

  router.post("/", clientService.createClient);

  router.put("/:id", clientService.updateClient);
  router.put("/", clientService.updateClient);

  return app.use("/api/client", router);
};

export { ClientRouter };
