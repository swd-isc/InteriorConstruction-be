import express from "express";
import clientController from "../../controller/client-controller/ClientController";

const router = express.Router();

const ClientRouter = (app) => {
  router.get("/page/:page", clientController.getClients);
  router.get("/:id", clientController.getClientById)

  return app.use("/client", router);
};

export { ClientRouter };
