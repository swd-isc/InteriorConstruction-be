import express from "express";
// import { getDeliveryById } from '../controller/DeliveryController';
import deliveryService from "../controller/DeliveryController";

const router = express.Router();

const DeliveryRouter = (app) => {
  // router.get('/:id', getDeliveryById);

  router.get("/", deliveryService.getDeliveries);
  router.get("/:id", deliveryService.getDeliveryById);

  router.post("/", deliveryService.createDelivery);

  router.put("/:id", deliveryService.updateDelivery);
  router.put("/", deliveryService.updateDelivery);

  return app.use("/api/delivery", router);
};

export { DeliveryRouter };
