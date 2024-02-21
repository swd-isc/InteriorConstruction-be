import express from "express";
import { designService } from "../controller/DesignController";

const router = express.Router();

const DesignRouter = (app) => {
  router.get("/", designService.getDesigns);
  router.get("/:id", designService.getDesignById);

  router.post("/", designService.createDesign);

  router.put("/:id", designService.updateDesign);
  router.put("/", designService.updateDesign);

  router.delete("/:id", designService.deleteDesign);
  router.delete("/", designService.deleteDesign);

  return app.use("/api/design", router);
};

export { DesignRouter };
