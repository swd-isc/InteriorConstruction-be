import express from "express";
import { designCardService } from "../controller/DesignCardController";

const router = express.Router();

/**
 * @swagger
 *  components:
 *      schemas:
 *          DesignCard:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *              description:
 *                type: string
 *              imgURL:
 *                type: string
 *          DesignCardData:
 *            type: object
 *            properties:
 *              id:
 *                type: string
 *              title:
 *                type: string
 *              description:
 *                type: string
 *              imgURL:
 *                type: string
 */

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
