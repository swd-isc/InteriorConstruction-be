import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization')
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) {
        return res.status(401).json("Don't have token.") //Unauthorized(ko có token gửi từ client về)
    }
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        console.log(decoded)
        //Write your validation code here. Example:
        // req.empID = decoded.empID
        next()
    } catch (err) {
        console.log(err)
        return res.status(403).json('Invalid token') //forbidden(Invalid token)
    }
}
