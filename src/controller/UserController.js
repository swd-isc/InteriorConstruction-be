import { getUserData } from "../services/getUserData"

export const getUserTest = async (req, res) => {
    let data = await getUserData();
    return res.status(200).json(
        {
            status: 200,
            data: data,
            message: "OK",
        }
    )
}