import { classificationByPage, classificationByType } from "../services/ClassificationServices";

export const getClassificationByPage = async (req, res) => {

    let data = await classificationByPage(req.params.page);
    return res.status(data.status).json(data);
}

export const getClassificationByType = async (req, res) => {

    let data = await classificationByType(req.query.type);
    return res.status(data.status).json(data);
}
