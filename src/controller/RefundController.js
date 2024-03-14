import { refundRepository } from "../services/RefundServices";

export const refundService = {
  getRefunds: async (req, res) => {
    let data = await refundRepository.getRefunds();
    return res.status(data.status).json(data);
  },

  getRefundById: async (req, res) => {
    let data = await refundRepository.getRefundById(req.params.id);
    return res.status(data.status).json(data);
  },

  getRefundsByClientId: async (req, res) => {
    let data = await refundRepository.getRefundsByClientId(req.user);
    return res.status(data.status).json(data);
  },

};
