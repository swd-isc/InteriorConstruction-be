import { furnitureServices } from "../services/FurnitureServices";

export const furnitureController = {
    furnitureByPage: async (req, res) => {

        let data = await furnitureServices.getFurnitureByPage(req.query.sort_by, req.query.page);
        return res.status(data.status).json(data);
    },

    furnitureById: async (req, res) => {

        let data = await furnitureServices.getFurnitureById(req.params.id);
        return res.status(data.status).json(data);
    },

    furnitureByClassificationId: async (req, res) => {

        let data = await furnitureServices.getFurnitureByClassificationId(req.query.classificationId, req.query.page, req.query.sort_by);
        return res.status(data.status).json(data);
    },

    filterSession: async (req, res) => {

        let data = await furnitureServices.filterSessionService(req.query);
        return res.status(data.status).json(data);
    },

    createFurController: async (req, res) => {
        let data = await furnitureServices.postFurniture(req.body);
        return res.status(data.status).json(data);
    },

    searchFurController: async (req, res) => {
        let data = await furnitureServices.getFurnitureByName(req.query.furName, req.query.page, req.query.sort_by);
        return res.status(data.status).json(data);
    },

    updateFurController: async (req, res) => {
        let data = await furnitureServices.putFurniture(req.params.id, req.body);
        return res.status(data.status).json(data);
    },

    deleteFurController: async (req, res) => {
        let data = await furnitureServices.deleteFurniture(req.params.id);
        return res.status(data.status).json(data);
    },




    furnitureByType: async (req, res) => {

        let data = await furnitureServices.getFurnitureByType(req.params.type);
        return res.status(data.status).json(data);
    },

    furnitureByClassificationByType: async (req, res) => {

        let data = await furnitureServices.getFurnitureByClassificationByType(req.params.type);
        return res.status(data.status).json(data);
    },

    furnitureByClassificationByName: async (req, res) => {

        let data = await furnitureServices.getFurnitureByClassificationByName(req.params.name);
        return res.status(data.status).json(data);
    },

    furnitureByMaterial: async (req, res) => {

        let data = await furnitureServices.getFurnitureByMaterial(req.params.materialName);
        return res.status(data.status).json(data);
    },

    furnitureByColor: async (req, res) => {

        let data = await furnitureServices.getFurnitureByColor(req.params.colorName);
        return res.status(data.status).json(data);
    }
}
