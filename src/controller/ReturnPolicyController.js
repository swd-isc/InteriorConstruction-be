import { returnPolicyById } from "../services/ReturnPolicyServices";

export const getReturnPolicyById = async (req, res) => {

    let data = await returnPolicyById(req.params.id);
    return res.status(data.status).json(data);
}