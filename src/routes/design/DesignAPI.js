import express from "express";
import designService from "../../controller/design-controller/DesignController";

const router = express.Router();

const DesignRouter = (app) => {
  router.get("/page/:page", designService.getDesigns);
  router.get("/:id", designService.getDesignById)

  return app.use("/design", router);
};

export { DesignRouter };
