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
    //Test Connection
    testConnect: async (req, res) => {
        let query = "select * from Account where empID like '" + req.empID + "'";
        mongoose.query(connectionString, query, (err, rows) => {
            const data = rows[0]
            return res.status(200).json(data)
        })
    },

    //Login
    loginUser: async (reqBody) => {
        const { email, password } = reqBody;

        const account = await Account.find({ email: email })
            .select('_id email password status');
        if (!account) {
            return {
                status: 401,
                messageError: "Wrong email",
            };
        }
        const validPassword = await bcrypt.compare(
            password, account.password
        );
        if (!validPassword) {
            return {
                status: 401,
                messageError: "Wrong password",
            };
        }
        if (account.status === "INACTIVE") {
            return {
                status: 401,
                messageError: "Your account has been inactive",
            };
        }
        if (account && validPassword) {
            const client = await Client.find({ accountId: account._id })
                .select('firstName lastName')
            const tokens = generateToken(client)
            updateRefreshToken(account._id, tokens.refreshToken)
            return {
                status: 200,
                data: tokens,
                message: "OK",
            };
        }
    },

    registerAccount: async (reqBody) => {
        const accountRes = await accountRepository.createAccount(reqBody);
        let client = {
            firstName: "Anonymous",
            lastName: "Human",
            birthDate: "2000-01-01T00:00:00.000+00:00",
            phone: "",
            photoURL: "",
            accountId: accountRes.data._id,
            contracts: []
        }
        const clientRes = await clientRepository.createClient(client);
        return clientRes;
    },

    //Update Token Expired
    updateToken: async (refreshToken, res) => {
        if (!refreshToken) {
            return {
                status: 401,
                messageError: "Don't have refresh Token",
            };
        }
        try {
            const decodedData = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
            console.log('check decoded data: ', decodedData);
            if (decodedData) {
                const tokens = await generateToken(decodedData)
                await updateRefreshToken(decodedData._id, tokens.refreshToken)
                return {
                    status: 200,
                    data: tokens,
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
    logoutUser: async (user) => {
        let query = `UPDATE Account SET refreshToken=NULL WHERE empID like '${user.empID}'`;
        mongoose.query(connectionString, query, (err, rows) => {
            if (err) {
                return res.status(401).json("Logout Fail: " + err);
            } else {
                return res.status(200).json("Logout Success");
            }
        });
    },
}

const generateToken = async (data) => {
    const { _id, firstName, lastName } = data
    const accessToken = jwt.sign({ _id, firstName, lastName }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '10m'
    });
    const refreshToken = jwt.sign({ _id, firstName, lastName }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '30m'
    })
    return { accessToken, refreshToken }
}

const updateRefreshToken = async (accountId, refreshToken) => {
    let query = "update Account set refreshToken='" + refreshToken + "' where empID='" + accountId + "'";
    mongoose.query(connectionString, query, (err, result) => {
        if (err) {
            return console.log("Something wrong with db: " + err)
        } else {
            return console.log('Updated refreshToken Success')
        }
    })
}
