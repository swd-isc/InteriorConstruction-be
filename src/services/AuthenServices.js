import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { accountRepository } from './AccountServices';
import { clientRepository } from './ClientServices';
import Account from "../models/Account";
import Client from "../models/Client";

dotenv.config();
const connectionString = process.env.CONNECTION_STRING_TO_DB;

export const authenServices = {

    //Login
    loginUser: async (reqBody) => {
        const { email, password } = reqBody;

        if (!email || !password) {
            return {
                status: 400,
                messageError: "Email and password required."
            };
        }
        const account = await accountRepository.getAccountByEmail(email);
        if (account.status !== 200) {
            return {
                status: account.status,
                messageError: account.messageError
            };
        }
        const validPassword = await bcrypt.compare(
            password, account.data.password
        );
        if (!validPassword) {
            return {
                status: 401,
                messageError: "Wrong password",
            };
        }
        if (account.data.status === "INACTIVE") {
            return {
                status: 401,
                messageError: "Your account has been inactive",
            };
        }
        if (account && validPassword) {
            const client = await clientRepository.getClientByAccountId(account.data._id);
            const tokens = await generateToken(client.data)
            const updateRes = await updateRefreshToken(account.data._id, tokens.refreshToken);
            if (updateRes.status !== 200) {
                return updateRes
            }
            return {
                status: 200,
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                message: "OK",
            };
        }
    },

    registerAccount: async (reqBody) => {
        const accountRes = await accountRepository.createAccount(reqBody);
        if (accountRes.status !== 201) {
            return accountRes;
        }
        console.log('check acc', accountRes);
        const client = {
            firstName: "Anonymous",
            lastName: "Human",
            birthDate: "2000-01-01T00:00:00.000+00:00",
            phone: "",
            photoURL: "",
            accountId: accountRes.data._id,
            contracts: []
        }
        const clientRes = await clientRepository.createClient(client);
        if (clientRes.status !== 201) {
            await accountRepository.deleteAccount(accountRes.data._id);
        }
        return clientRes;
    },

    //Update Token Expired
    updateToken: async (refreshToken) => {
        if (!refreshToken) {
            return {
                status: 401,
                messageError: "Don't have refresh Token",
            };
        }
        try {
            const decodedData = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
            // console.log('check decoded data: ', decodedData);
            if (decodedData) {
                const tokens = await generateToken(decodedData)
                const clientRes = await clientRepository.getAccountIdByClientId(decodedData._id);
                if (clientRes.status !== 200) {
                    return clientRes
                }
                const accountRes = await accountRepository.getAccountById(clientRes.data.accountId);
                if (accountRes.status !== 200) {
                    return accountRes;
                }
                if (accountRes.data.refreshToken !== refreshToken) {
                    return {
                        status: 403,
                        messageError: "Request a wrong refresh Token.",
                    };
                }
                const updateRes = await updateRefreshToken(clientRes.data.accountId, tokens.refreshToken);
                if (updateRes.status !== 200) {
                    return updateRes
                }
                return {
                    status: 200,
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken,
                    message: "OK",
                };
            }
        } catch (error) {
            console.log(error)
            return {
                status: 403,
                error: error.name,
                messageError: error.message,
            }
        }
    },

    //Logout
    logoutUser: async (clientId) => {
        const responseData = await clientRepository.getAccountIdByClientId(clientId);
        return await accountRepository.updateAccount(responseData.data.accountId, { refreshToken: '' });
    },
}

const generateToken = async (data) => {
    const { _id, firstName, lastName, birthDate, phone, photoURL, accountId } = data
    const accessToken = jwt.sign({ _id, firstName, lastName, birthDate, phone, photoURL, accountId }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '2d'
    });
    const refreshToken = jwt.sign({ _id, firstName, lastName, birthDate, phone, photoURL, accountId }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '3d'
    })
    return { accessToken, refreshToken }
}

const updateRefreshToken = async (accountId, refreshToken) => {
    return await accountRepository.updateAccount(accountId, { refreshToken: refreshToken })
}
