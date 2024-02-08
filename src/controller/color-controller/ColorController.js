import { getColorByPage } from "../../services/color-services/colorServices";

export const getColorData = async (req, res) => {

    let data = await getColorByPage(req.params.page);
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
