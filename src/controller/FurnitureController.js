import { getFurnitureByPage } from "../services/FurnitureServices";

export const getFurnitureData = async (req, res) => {

    let data = await getFurnitureByPage(req.params.page);
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
