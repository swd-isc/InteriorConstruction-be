import express from "express";
import { refundService } from "../controller/RefundController";
import { isAdmin, isClient, isCurrentUser, isCurrentUserOrAdmin, verifyToken } from "../middleware/authen";

const router = express.Router();


const RefundRouter = (app) => {

  router.get("/", verifyToken, isAdmin, refundService.getRefunds);

  router.get('/client/', verifyToken, isClient, refundService.getRefundsByClientId)
  
  router.get("/:id", verifyToken, refundService.getRefundById);
 
  return app.use("/api/refund", router);
};

export { RefundRouter };
