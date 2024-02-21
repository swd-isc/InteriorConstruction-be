import { deliveryRepository } from "../services/DeliveryServices";

export const deliveryService = {
  getDeliveries: async (req, res) => {
    let data = await deliveryRepository.getDeliveries(req.query.page);
    return res.status(data.status).json(data);
  },

  getDeliveryById: async (req, res) => {
    let data = await deliveryRepository.getDeliveryById(req.params.id);
    return res.status(data.status).json(data);
  },

  createDelivery: async (req, res) => {
    let data = await deliveryRepository.createDelivery(req.body);
    return res.status(data.status).json(data);
  },

  updateDelivery: async (req, res) => {
    let data = await deliveryRepository.updateDelivery(req.params.id, req.body);
    return res.status(data.status).json(data);
  },

  deleteDelivery: async (req, res) => {
    let data = await deliveryRepository.deleteDelivery(req.params.id);
    return res.status(data.status).json(data);
  },
};
