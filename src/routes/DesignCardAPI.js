import express from "express";
import { designCardService } from "../controller/DesignCardController";
import { isAdmin, verifyToken } from "../middleware/authen";

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

   // router.get("/", designCardService.getDesignCards); //Unused

   // router.get("/:id", designCardService.getDesignCardById); //Unused

   // router.post("/", verifyToken, isAdmin, designCardService.createDesignCard); //Unused

   // router.put("/:id", verifyToken, isAdmin, designCardService.updateDesignCard); //Unused
   // router.put("/", verifyToken, isAdmin, designCardService.updateDesignCard); //Unused

   // router.delete("/:id", verifyToken, isAdmin, designCardService.deleteDesignCard); //Unused
   // router.delete("/", verifyToken, isAdmin, designCardService.deleteDesignCard); //Unused

   return app.use("/api/design-card", router);
};

export { DesignCardRouter };
