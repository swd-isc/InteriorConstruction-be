import { loginUser, logoutUser, testConnect, updateToken } from "../services/AuthenServices";

export const getTestAuthen = async (req, res) => {

    let data = await testConnect();
    return res.status(data.status).json(data);
}

export const logInController = async (req, res) => {

    let data = await loginUser(req.body);
    return res.status(data.status).json(data);
}

export const updateTokenController = async (req, res) => {

    let data = await updateToken();
    return res.status(data.status).json(data);
}

export const logOutController = async (req, res) => {

    let data = await logoutUser(req.body);
    return res.status(data.status).json(data);
}
