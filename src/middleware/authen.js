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
        let data = {}
        //Write your validation code here. Example:
        try {
            const url = process.env.URL_DB;
            await mongoose.connect(url, { family: 4, dbName: 'interiorConstruction' });

            data = await Client.findById(decoded._id)
                .populate({
                    path: "accountId",
                    select: "_id email role status", // Select only the fields you need
                });

        } catch (error) {
            return res.status(500).json({
                messageError: error
            })
        } finally {
            // Close the database connection
            mongoose.connection.close();
        }

        if (data) {

            req.user = data;

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

export const isCurrentUser = async (req, res, next) => {
    const authHeader = req.header('Authorization')
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) {
        return res.status(401).json("Don't have token.") //Unauthorized(ko có token gửi từ client về)
    }
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const reqId = req.params.id;
        if (reqId !== decoded._id) {
            return res.status(403).json({
                messageError: "Access forbidden. Not current user."
            }) //forbidden not an current user
        } else {
            next();
        }

    } catch (err) {
        return res.status(403).json({
            error: err.name,
            messageError: err.message
        }) //forbidden(Invalid token)
    }
}

export const isCurrentUserOrAdmin = async (req, res, next) => {
    const authHeader = req.header('Authorization')
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) {
        return res.status(401).json("Don't have token.") //Unauthorized(ko có token gửi từ client về)
    }
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        let data = {}

        const reqId = req.params.id;
        if (reqId !== decoded._id) {
            try {
                const url = process.env.URL_DB;
                await mongoose.connect(url, { family: 4, dbName: 'interiorConstruction' });

                data = await Client.findById(decoded._id)
                    .populate({
                        path: 'accountId',
                        select: '_id email role logInMethod status'
                    });
            } catch (error) {
                return res.status(500).json({
                    messageError: error
                })
            } finally {
                // Close the database connection
                mongoose.connection.close();
            }

            if (data.accountId.role === "ADMIN") {
                next()
            } else {
                return res.status(403).json({
                    messageError: "Access forbidden. Not current user or admin."
                }) //forbidden not an current user or admin
            }
        } else {
            next();
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
        let data = {};

        //Write your validation code here. Example:
        try {
            const url = process.env.URL_DB;
            await mongoose.connect(url, { family: 4, dbName: 'interiorConstruction' });

            data = await Client.findById(decoded._id)
                .populate({
                    path: 'accountId',
                    select: '_id email role logInMethod status'
                });

        } catch (error) {
            return res.status(500).json({
                messageError: error
            })
        } finally {
            // Close the database connection
            mongoose.connection.close();
        }

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
