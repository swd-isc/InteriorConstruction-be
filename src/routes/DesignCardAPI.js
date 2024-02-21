import express from "express";
import { designCardService } from "../controller/DesignCardController";

const router = express.Router();

const DesignCardRouter = (app) => {
  router.get("/", designCardService.getDesignCards);
  router.get("/:id", designCardService.getDesignCardById);

  router.post("/", designCardService.createDesignCard);

  router.put("/:id", designCardService.updateDesignCard);
  router.put("/", designCardService.updateDesignCard);

  router.delete("/:id", designCardService.deleteDesignCard);
  router.delete("/", designCardService.deleteDesignCard);

  return app.use("/api/design-card", router);
};

export { DesignCardRouter };
