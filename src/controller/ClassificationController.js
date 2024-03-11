import { classificationServices } from "../services/ClassificationServices";

export const classificationController = {
    getClassificationByPage: async (req, res) => {

        let data = await classificationServices.classificationByPage(req.params.page);
        return res.status(data.status).json(data);
    },

    getClassification: async(req, res) => {
        if (!req.query.all || req.query.all == '0') {
            let data = await classificationServices.classificationByType(req.query.type, req.query.sort_by);
            return res.status(data.status).json(data);
        }
        else {
            let data = await classificationServices.getClassificationAll();
            return res.status(data.status).json(data);
        }
    },

    getClassificationAll: async (req, res) => {

        let data = await classificationServices.getClassificationAll();
        return res.status(data.status).json(data);

    },

    getClassificationByType: async (req, res) => {

        let data = await classificationServices.classificationByType(req.query.type, req.query.sort_by);
        return res.status(data.status).json(data);
    },

    postClassificationController: async (req, res) => {

        let data = await classificationServices.postClassification(req.body);
        return res.status(data.status).json(data);
    },

    putClassificationController: async (req, res) => {
        let data = await classificationServices.putClassification(req.params.id, req.body);
        return res.status(data.status).json(data);
    },

    deleteClassificationController: async (req, res) => {
        let data = await classificationServices.deleteClassification(req.params.id);
        return res.status(data.status).json(data);
    }
}
