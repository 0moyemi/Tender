const jwt = require("jsonwebtoken")

const vendorAuth = (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader) {
        return res.status(401).send({ status: false, message: "No token" })
    }


    const token = authHeader.startsWith("Bearer")
        ? authHeader.split(" ")[1]
        : authHeader

    console.log("Auth header:", authHeader);

    jwt.verify(token, process.env.JWTsecret, (err, decoded) => {
        if (err) {
            console.log("JWT verify error:", err);
            return res.status(401).send({ status: false, message: "Invalid or expired token" })
        }

        console.log("Decoded payload:", decoded);

        if (decoded.role !== "vendor") {
            return res.status(403).send({ status: false, message: "Forbidden" })
        }

        req.vendorId = decoded.vendorId
        next()
    })
}

module.exports = vendorAuth