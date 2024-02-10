import express from "express";
import clientService from "../controller/ClientController";

const router = express.Router();

const ClientRouter = (app) => {
  router.get("/page/:page", clientService.getClients);
  router.get("/:id", clientService.getClientById);

  router.post("/", clientService.createClient);
  return app.use("/client", router);
};

export { ClientRouter };
