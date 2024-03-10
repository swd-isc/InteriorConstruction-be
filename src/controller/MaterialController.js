import { materialServices } from "../services/MaterialServices";

export const materialController = {
    getMaterialData: async (req, res) => {

        let data = await materialServices.getMaterialByPage(req.params.page);
        return res.status(data.status).json(data);
    },

    getMaterialById: async (req, res) => {

        let data = await materialServices.getMaterialById(req.params.id);
        return res.status(data.status).json(data);
    },


    postMaterial: async (req, res) => {
        let data = await materialServices.createMaterial(req.body);
        return res.status(data.status).json(data);
    },

    putMaterialController: async (req, res) => {
        let data = await materialServices.putMaterial(req.params.id, req.body);
        return res.status(data.status).json(data);
    },

    deleteMaterialController: async (req, res) => {
        let data = await materialServices.deleteMaterial(req.params.id);
        return res.status(data.status).json(data);
    }
}
