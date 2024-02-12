import { getClassificationByPage } from "../services/ClassificationServices";

export const getClassificationData = async (req, res) => {

    let data = await getClassificationByPage(req.params.page);
    return res.status(data.status).json(data);
}
