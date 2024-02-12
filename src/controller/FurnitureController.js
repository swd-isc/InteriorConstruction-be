import { getFurnitureByClassification, getFurnitureById, getFurnitureByPage, getFurnitureByType } from "../services/FurnitureServices";

export const furnitureByPage = async (req, res) => {

    let data = await getFurnitureByPage(req.params.page);
    return res.status(data.status).json(data);
}

export const furnitureById = async (req, res) => {

    let data = await getFurnitureById(req.params.id);
    return res.status(data.status).json(data);
}

export const furnitureByType = async (req, res) => {

    let data = await getFurnitureByType(req.params.type);
    return res.status(data.status).json(data);
}

export const furnitureByClassification = async (req, res) => {

    let data = await getFurnitureByClassification(req.params.classification);
    return res.status(data.status).json(data);
}
