// import { deliveryById } from "../services/DeliveryServices";

import deliveryRepository from "../services/DeliveryServices";

// export const getDeliveryById = async (req, res) => {

//     let data = await deliveryById(req.params.id);
//     return res.status(data.status).json(data);
// }

exports.getDeliveries = async (req, res) => {
  let data = await deliveryRepository.getDeliveries(req.query.page);
  return res.status(data.status).json(data);
};

exports.getDeliveryById = async (req, res) => {
  let data = await deliveryRepository.getDeliveryById(req.params.id);
  return res.status(data.status).json(data);
};

exports.createDelivery = async (req, res) => {
  let data = await deliveryRepository.createDelivery(req.body);
  return res.status(data.status).json(data);
};

exports.updateDelivery = async (req, res) => {
  let data = await deliveryRepository.updateDelivery(req.params.id, req.body);
  return res.status(data.status).json(data);
};
