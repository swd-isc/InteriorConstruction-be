import { findFurnitureSortedByPrice, getFurnitureByClassificationByName, getFurnitureByClassificationByType, getFurnitureByClassificationId, getFurnitureByColor, getFurnitureById, getFurnitureByMaterial, getFurnitureByPage, getFurnitureByType } from "../services/FurnitureServices";

export const furnitureByPage = async (req, res) => {

    let data = await getFurnitureByPage(req.query.sort_by, req.query.page);
    return res.status(data.status).json(data);
}

export const furnitureById = async (req, res) => {

    let data = await getFurnitureById(req.query.id);
    return res.status(data.status).json(data);
}

export const furnitureByClassificationId = async (req, res) => {

    let data = await getFurnitureByClassificationId(req.query.classificationId, req.query.page);
    return res.status(data.status).json(data);
}

export const furnitureByType = async (req, res) => {

    let data = await getFurnitureByType(req.params.type);
    return res.status(data.status).json(data);
}

export const furnitureByClassificationByType = async (req, res) => {

    let data = await getFurnitureByClassificationByType(req.params.type);
    return res.status(data.status).json(data);
}

export const furnitureByClassificationByName = async (req, res) => {

    let data = await getFurnitureByClassificationByName(req.params.name);
    return res.status(data.status).json(data);
}

export const furnitureByMaterial = async (req, res) => {

    let data = await getFurnitureByMaterial(req.params.materialName);
    return res.status(data.status).json(data);
}

export const furnitureByColor = async (req, res) => {

    let data = await getFurnitureByColor(req.params.colorName);
    return res.status(data.status).json(data);
}

export const furnitureByPrice = async (req, res) => {

    let data = await findFurnitureSortedByPrice(req.params.asc);
    return res.status(data.status).json(data);
}
