import { classificationByPage, classificationByType, deleteClassification, postClassification, putClassification } from "../services/ClassificationServices";

export const classificationController = {
    getClassificationByPage: async (req, res) => {

        let data = await classificationByPage(req.params.page);
        return res.status(data.status).json(data);
    },

    getClassificationByType: async (req, res) => {

        let data = await classificationByType(req.query.type, req.query.sort_by);
        return res.status(data.status).json(data);
    },

    postClassificationController: async (req, res) => {

        let data = await postClassification(req.body);
        return res.status(data.status).json(data);
    },

    putClassificationController: async (req, res) => {
        let data = await putClassification(req.params.id, req.body);
        return res.status(data.status).json(data);
    },

    deleteClassificationController: async (req, res) => {
        let data = await deleteClassification(req.params.id);
        return res.status(data.status).json(data);
    }
}
