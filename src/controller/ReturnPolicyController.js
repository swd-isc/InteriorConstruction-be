import { returnPolicyServices } from "../services/ReturnPolicyServices";

export const returnPolicyController = {
    getReturnPolicyById: async (req, res) => {

        let data = await returnPolicyServices.returnPolicyById(req.params.id);
        return res.status(data.status).json(data);
    },

    postReturnPolicyController: async (req, res) => {

        let data = await returnPolicyServices.postReturnPolicy(req.body);
        return res.status(data.status).json(data);
    },

    putReturnPolicyController: async (req, res) => {
        let data = await returnPolicyServices.putReturnPolicy(req.params.id, req.body);
        return res.status(data.status).json(data);
    },

    deleteReturnPolicyController: async (req, res) => {
        let data = await returnPolicyServices.deleteReturnPolicy(req.params.id);
        return res.status(data.status).json(data);
    }
}
