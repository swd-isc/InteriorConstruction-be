import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

dotenv.config();
const connectionString = process.env.CONNECTION_STRING_TO_DB;

const generateToken = (data) => {
    const { empID, name, password, dob, gender, idCard, address, phone, email, major, active, role, imageURL, contractURL } = data
    const accessToken = jwt.sign({ empID, name, password, dob, gender, idCard, address, phone, email, major, active, role, imageURL, contractURL }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '10m'
    });
    const refreshToken = jwt.sign({ empID, name, password, dob, gender, idCard, address, phone, email, major, active, role, imageURL, contractURL }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '30m'
    })
    return { accessToken, refreshToken, role }
}

const updateRefreshToken = (empID, refreshToken) => {
    let query = "update Account set refreshToken='" + refreshToken + "' where empID='" + empID + "'";
    mongoose.query(connectionString, query, (err, result) => {
        if (err) {
            return console.log("Something wrong with db: " + err)
        } else {
            return console.log('Updated refreshToken Success')
        }
    })
}

//Test Connection
export const testConnect = async (req, res) => {
    let query = "select * from Account where empID like '" + req.empID + "'";
    mongoose.query(connectionString, query, (err, rows) => {
        const data = rows[0]
        return res.status(200).json(data)
    })
}

//Login
export const loginUser = async (req, res) => {
    const { usermail, password } = req.body;
    let user
    let query = "select empID, empName, password, dob, gender, idCard, address, phone, email, major, active, role, imageURL, contractURL from Account where email like '" + usermail + "'";
    mongoose.query(connectionString, query, async (err, rows) => {
        if (rows.length == 0) {
            return res.status(401).json("Wrong email");
        }
        user = rows[0]
        const validPassword = await bcrypt.compare(
            password, user.password
        );
        if (!validPassword) {
            return res.status(401).json("Wrong password")
        }
        if (user.active == 0) {
            return res.status(401).json("Your account has been inactive")
        }
        if (user && validPassword) {
            const tokens = generateToken(user)
            updateRefreshToken(user.empID, tokens.refreshToken)
            return res.status(200).json({ tokens, user })
        }
    });
}

//Update Token Expired
export const updateToken = (req, res) => {
    const refreshToken = req.body.refreshToken
    if (!refreshToken) {
        return res.status(401).json("Don't have refresh Token");
    }
    let userData
    let query = "select * from Account where refreshToken like '" + refreshToken + "'";
    mongoose.query(connectionString, query, (err, rows) => {
        userData = rows[0]
        if (!userData) {
            return res.status(403).json("Request a wrong refresh Token");
        }
        try {
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
            const tokens = generateToken(userData)
            updateRefreshToken(userData.empID, tokens.refreshToken)
            const user = {
                empID: userData.empID,
                empName: userData.empName,
                password: userData.password,
                dob: userData.dob,
                gender: userData.gender,
                idCard: userData.idCard,
                address: userData.address,
                phone: userData.phone,
                email: userData.email,
                major: userData.major,
                active: userData.active,
                role: userData.role,
                imageURL: userData.imageURL,
                contractURL: userData.contractURL
            }
            return res.json({ tokens, user })
        } catch (error) {
            console.log(error)
            return res.status(403).json("Token expired");
        }
    });
}

//Logout
export const logoutUser = async (user) => {
    let query = `UPDATE Account SET refreshToken=NULL WHERE empID like '${user.empID}'`;
    mongoose.query(connectionString, query, (err, rows) => {
        if (err) {
            return res.status(401).json("Logout Fail: " + err);
        } else {
            return res.status(200).json("Logout Success");
        }
    });
}
