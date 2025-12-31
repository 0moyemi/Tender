const jwt = require("jsonwebtoken")

const vendorAuth = (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader) {
        return res.status(401).send({ status: false, message: "No token" })
    }


    const token = authHeader.startsWith("Bearer")
        ? authHeader.split(" ")[1]
        : authHeader

    // ...removed dev artifact...

    jwt.verify(token, process.env.JWTsecret, (err, decoded) => {
        if (err) {
            // ...removed dev artifact...
            return res.status(401).send({ status: false, message: "Invalid or expired token" })
        }

        // ...removed dev artifact...

        if (decoded.role !== "vendor") {
            return res.status(403).send({ status: false, message: "Forbidden" })
        }

        req.vendorId = decoded.vendorId
        next()
    })
}

module.exports = vendorAuth