import { colorById, getColorByPage, postColor } from "../services/ColorServices";

export const getColorData = async (req, res) => {

    let data = await getColorByPage(req.params.page);
    return res.status(data.status).json(data);
}

export const getColorById = async (req, res) => {

    let data = await colorById(req.params.id);
    return res.status(data.status).json(data);
}

export const postColorController = async (req, res) => {
    let data = await postColor(req.body);
    return res.status(data.status).json(data);
}
