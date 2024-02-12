import { getFurnitureByPage, getFurnitureByType } from "../services/FurnitureServices";

export const getFurniturePage = async (req, res) => {

    let data = await getFurnitureByPage(req.params.page);
    return res.status(data.status).json(data);
}

export const getFurnitureType = async (req, res) => {

    let data = await getFurnitureByType(req.params.type);
    return res.status(data.status).json(data);
}
