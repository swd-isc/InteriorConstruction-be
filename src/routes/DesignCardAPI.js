import express from "express";
import { designCardService } from "../controller/DesignCardController";

const router = express.Router();

const DesignCardRouter = (app) => {
  router.post("/", designCardService.createDesignCard);

  router.put("/:id", designCardService.updateDesignCard);
  router.put("/", designCardService.updateDesignCard);

  return app.use("/api/design-card", router);
};

export { DesignCardRouter };
