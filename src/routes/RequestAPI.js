import express from "express";
import { requestService } from "../controller/RequestController";
import { isAdmin, verifyToken } from "../middleware/authen";

const router = express.Router();

const RequestRouter = (app) => {
  router.get("/", verifyToken, requestService.getRequests);
  router.get("/:id", verifyToken, requestService.getRequestById);
  router.get("/client/:id", verifyToken, requestService.getRequestsByClientId);

  router.post("/", verifyToken, requestService.createRequest);

  router.put("/:id", verifyToken, requestService.updateRequest);
  router.delete("/:id", verifyToken, requestService.deleteRequest);

  return app.use("/api/request", router);
};

export { RequestRouter };
