import express from "express";
import { deliveryService } from "../controller/DeliveryController";

const router = express.Router();

const DeliveryRouter = (app) => {
  router.get("/", deliveryService.getDeliveries);
  router.get("/:id", deliveryService.getDeliveryById);

  router.post("/", deliveryService.createDelivery);

  router.put("/:id", deliveryService.updateDelivery);
  router.put("/", deliveryService.updateDelivery);

  router.delete("/:id", deliveryService.deleteDelivery);
  router.delete("/", deliveryService.deleteDelivery);

  return app.use("/api/delivery", router);
};

export { DeliveryRouter };
