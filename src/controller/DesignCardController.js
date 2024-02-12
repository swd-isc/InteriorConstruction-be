import { designCardById } from "../services/DesignCardServices";

export const getDesignCardById = async (req, res) => {

    let data = await designCardById(req.params.id);
    return res.status(data.status).json(data);
}