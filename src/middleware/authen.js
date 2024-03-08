import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Client from '../models/Client';

export const verifyToken = async (req, res, next) => {
    const authHeader = req.header('Authorization')
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) {
        return res.status(401).json("Don't have token.") //Unauthorized(ko có token gửi từ client về)
    }
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        //Write your validation code here. Example:
        const url = process.env.URL_DB;
        await mongoose.connect(url, { family: 4, dbName: 'interiorConstruction' });

        let data = await Client.findById(decoded._id)

        if (data) {
            next()
        } else {
            return res.status(403).json({
                messageError: "Invalid token."
            }) //forbidden(Invalid token)
        }
    } catch (err) {
        return res.status(403).json({
            error: err.name,
            messageError: err.message
        }) //forbidden(Invalid token)
    }
}

export const isAdmin = async (req, res, next) => {
    const authHeader = req.header('Authorization')
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) {
        return res.status(401).json("Don't have token.") //Unauthorized(ko có token gửi từ client về)
    }
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        //Write your validation code here. Example:
        const url = process.env.URL_DB;
        await mongoose.connect(url, { family: 4, dbName: 'interiorConstruction' });

        let data = await Client.findById(decoded._id)
            .populate({
                path: 'accountId',
                select: '_id email role logInMethod status'
            });

        if (data.accountId.role === "ADMIN") {
            next()
        } else {
            return res.status(403).json({
                messageError: "Access forbidden. Admin access required."
            }) //forbidden not an admin
        }
    } catch (err) {
        return res.status(403).json({
            error: err.name,
            messageError: err.message
        }) //forbidden(Invalid token)
    }
}
