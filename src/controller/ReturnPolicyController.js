import { postReturnPolicy, returnPolicyById } from "../services/ReturnPolicyServices";

export const getReturnPolicyById = async (req, res) => {

    let data = await returnPolicyById(req.params.id);
    return res.status(data.status).json(data);
}

export const postReturnPolicyController = async (req, res) => {

    let data = await postReturnPolicy(req.body);
    return res.status(data.status).json(data);
}