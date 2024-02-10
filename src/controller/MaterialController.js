import { createMaterial, getMaterialByPage } from "../services/MaterialServices";

export const getMaterialData = async (req, res) => {

    let data = await getMaterialByPage(req.params.page);
    if (!data.error) {
        return res.status(200).json(
            {
                status: 200,
                data: data,
                message: "OK",
            }
        )
    } else {
        return res.status(data.status).json(
            {
                status: data.status,
                messageError: data.error,
            }
        )
    }
}

export const postMaterial = async (req, res) => {
    let data = await createMaterial(req.body);
    console.log('check: ', data);
    if (!data.error) {
        return res.status(data.status).json(
            {
                status: 200,
                data: data,
                message: "OK",
            }
        )
    } else {
        return res.status(data.status).json(
            {
                status: data.status,
                messageError: data.error,
            }
        )
    }
}
