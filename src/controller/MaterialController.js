import { createMaterial, getMaterialByPage, putMaterial } from "../services/MaterialServices";

export const getMaterialData = async (req, res) => {

    let data = await getMaterialByPage(req.params.page);
    return res.status(data.status).json(data);
}

export const postMaterial = async (req, res) => {
    let data = await createMaterial(req.body);
    return res.status(data.status).json(data);
}

export const putMaterialController = async (req, res) => {
    let data = await putMaterial(req.params.id, req.body);
    return res.status(data.status).json(data);
}
