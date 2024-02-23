import { authenServices } from "../services/AuthenServices";

export const authenController = {
    getTestAuthen: async (req, res) => {

        let data = await authenServices.testConnect();
        return res.status(data.status).json(data);
    },

    logInController: async (req, res) => {

        let data = await authenServices.loginUser(req.body);
        return res.status(data.status).json(data);
    },

    registerController: async (req, res) => {

        let data = await authenServices.registerAccount(req.body);
        return res.status(data.status).json(data);
    },

    updateTokenController: async (req, res) => {

        let data = await authenServices.updateToken(req.body.refreshToken);
        return res.status(data.status).json(data);
    },

    logOutController: async (req, res) => {

        let data = await authenServices.logoutUser(req.body.clientId);
        return res.status(data.status).json(data);
    },
}
