import { deliveryById } from "../services/DeliveryServices";

export const getDeliveryById = async (req, res) => {

    let data = await deliveryById(req.params.id);
    return res.status(data.status).json(data);
}