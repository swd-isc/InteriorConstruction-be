import { colorServices } from "../services/ColorServices";

export const colorController = {
    getColorData: async (req, res) => {

        let data = await colorServices.getColorByPage(req.params.page);
        return res.status(data.status).json(data);
    },

    getColorById: async (req, res) => {

        let data = await colorServices.colorById(req.params.id);
        return res.status(data.status).json(data);
    },

    postColorController: async (req, res) => {
        let data = await colorServices.postColor(req.body);
        return res.status(data.status).json(data);
    },

    putColorController: async (req, res) => {
        let data = await colorServices.putColor(req.params.id, req.body);
        return res.status(data.status).json(data);
    },

    deleteColorController: async (req, res) => {
        let data = await colorServices.deleteColor(req.params.id);
        return res.status(data.status).json(data);
    }
}
