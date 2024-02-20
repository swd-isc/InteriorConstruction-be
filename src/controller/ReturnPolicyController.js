import { deleteReturnPolicy, postReturnPolicy, putReturnPolicy, returnPolicyById } from "../services/ReturnPolicyServices";

export const getReturnPolicyById = async (req, res) => {

    let data = await returnPolicyById(req.params.id);
    return res.status(data.status).json(data);
}

export const postReturnPolicyController = async (req, res) => {

    let data = await postReturnPolicy(req.body);
    return res.status(data.status).json(data);
}

export const putReturnPolicyController = async (req, res) => {
    let data = await putReturnPolicy(req.params.id, req.body);
    return res.status(data.status).json(data);
}

export const deleteReturnPolicyController = async (req, res) => {
    let data = await deleteReturnPolicy(req.params.id);
    return res.status(data.status).json(data);
}
