import express from "express";
import { orderService } from "../controller/OrderController";
import { isAdmin, verifyToken } from "../middleware/authen";

const router = express.Router();

const OrderRouter = (app) => {
  router.get("/", orderService.getOrders);
  router.get("/:id", orderService.getOrderById);

  router.post("/", orderService.createOrder);

  router.put("/:id", orderService.updateOrder);

  router.delete("/:id", orderService.deleteOrder);

  return app.use("/api/order", router);
};

export { OrderRouter };
