import express from "express";
// import { getDesignCardById } from '../controller/DesignCardController';
import designCardSerivce from "../controller/DesignCardController";

const router = express.Router();

const DesignCardRouter = (app) => {
  // router.get('/:id', getDesignCardById);

  router.post("/", designCardSerivce.createDesignCard);

  return app.use("/api/design-card", router);
};

export { DesignCardRouter };
