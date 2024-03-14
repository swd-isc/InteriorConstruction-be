import express from "express";
import { refundService } from "../controller/RefundController";
import { isAdmin, isClient, isCurrentUser, isCurrentUserOrAdmin, verifyToken } from "../middleware/authen";

const router = express.Router();
/**
* @swagger
*  components:
*      schemas:
*          Refund:
*              type: object
*              properties:
*                  _id:
*                      type: string
*                  vnp_TxnRef:
*                      type: string
*                  vnp_Amount:
*                      type: number
*                  vnp_OrderInfo:
*                      type: string
*                  vnp_BankCode:
*                      type: string
*                  vnp_PayDate:
*                      type: string
*                  vnp_TransactionNo:
*                      type: string
*                  vnp_TransactionType:
*                      type: string
*                  vnp_TransactionStatus:
*                      type: string
*                  clientId:
*                      type: string
*                  contractId:
*                      type: string
*          RefundData:
*              type: object
*              properties:
*                  _id:
*                      type: string
*                  vnp_TxnRef:
*                      type: string
*                  vnp_Amount:
*                      type: number
*                  vnp_OrderInfo:
*                      type: string
*                  vnp_BankCode:
*                      type: string
*                  vnp_PayDate:
*                      type: string
*                  vnp_TransactionNo:
*                      type: string
*                  vnp_TransactionType:
*                      type: string
*                  vnp_TransactionStatus:
*                      type: string
*                  clientId:
*                      type: object
*                      properties:
*                         _id:
*                           type: string
*                         firstName:
*                           type: string
*                         lastName:
*                           type: string
*                  contractId:
*                      type: string
*/

const RefundRouter = (app) => {

  /**
    * @swagger
    * /api/refund/:
    *  get:
    *      security:
    *          - bearerAuth: []
    *      tags:
    *          - Refunds
    *      summary: Admin get all refund orders
    *      description: This endpoint is for Admin getting all refunds orders
    *      responses:
    *          200:
    *              description: OK
    *              content:
    *                  application/json:
    *                      schema:
    *                          type: object
    *                          properties:
    *                              status:
    *                                  type: number
    *                              data:
    *                                  type: array
    *                                  items:
    *                                     $ref: '#components/schemas/RefundData'
    *                              message:
    *                                  type: string
    *          400:
    *              description: Bad request
    *              content:
    *                  application/json:
    *                      schema:
    *                          type: object
    *                          properties:
    *                              status:
    *                                  type: number
    *                              messageError:
    *                                  type: string
    */
  router.get("/", verifyToken, isAdmin, refundService.getRefunds);

  /**
   * @swagger
   * /api/refund/client:
   *  get:
   *      security:
   *          - bearerAuth: []
   *      tags:
   *          - Refunds
   *      summary: Client get all refund orders
   *      description: This endpoint is for Client getting all his/her refunds orders
   *      responses:
   *          200:
   *              description: OK
   *              content:
   *                  application/json:
   *                      schema:
   *                          type: object
   *                          properties:
   *                              status:
   *                                  type: number
   *                              data:
   *                                  type: array
   *                                  items:
   *                                     $ref: '#components/schemas/Refund'
   *                              message:
   *                                  type: string
   *          400:
   *              description: Bad request
   *              content:
   *                  application/json:
   *                      schema:
   *                          type: object
   *                          properties:
   *                              status:
   *                                  type: number
   *                              messageError:
   *                                  type: string
   */
  router.get('/client/', verifyToken, isClient, refundService.getRefundsByClientId)

  /**
   * @swagger
   * /api/refund/{id}:
   *  get:
   *      security:
   *          - bearerAuth: []
   *      tags:
   *          - Refunds
   *      summary: Get refund order by refundId
   *      description: |
   *        - This endpoint is for getting refund order by refundId
   *        - `Note: `
   *            - Client can only get his/her refund orders
   *            - Admin can get all refund detail
   *      parameters:
   *        - in: path
   *          name: id
   *          required: true
   *          description: Id required
   *          schema:
   *            type: string
   *      responses:
   *          200:
   *              description: OK
   *              content:
   *                  application/json:
   *                      schema:
   *                          type: object
   *                          properties:
   *                              status:
   *                                  type: number
   *                              data:
   *                                  $ref: '#components/schemas/RefundData'
   *                              message:
   *                                  type: string
   *          400:
   *              description: Bad request
   *              content:
   *                  application/json:
   *                      schema:
   *                          type: object
   *                          properties:
   *                              status:
   *                                  type: number
   *                              messageError:
   *                                  type: string
   */
  router.get("/:id", verifyToken, refundService.getRefundById);

  return app.use("/api/refund", router);
};

export { RefundRouter };
