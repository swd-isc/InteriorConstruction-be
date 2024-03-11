import { orderRepository } from "../services/OrderServices";

export const orderService = {
  getOrders: async (req, res) => {
    let data = await orderRepository.getOrders();
    return res.status(data.status).json(data);
  },

  getOrderById: async (req, res) => {
    let data = await orderRepository.getOrderById(req.params.id);
    return res.status(data.status).json(data);
  },

  createOrder: async (req, res) => {
    let data = await orderRepository.createOrder(req.body);
    return res.status(data.status).json(data);
  },

  updateOrder: async (req, res) => {
    let data = await orderRepository.updateOrder(req.params.id, req.body);
    return res.status(data.status).json(data);
  },

  deleteOrder: async (req, res) => {
    let data = await orderRepository.deleteOrder(req.params.id);
    return res.status(data.status).json(data);
  },
};
