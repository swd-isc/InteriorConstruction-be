import express from "express";
import designController from "../../controller/design-controller/DesignController";

const router = express.Router();

const DesignRouter = (app) => {
  router.get("/page/:page", designController.getDesigns);
  router.get("/:id", designController.getDesignById)

  return app.use("/design", router);
};

export { DesignRouter };
