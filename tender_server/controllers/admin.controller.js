const admin = require("../models/admin.model")
const vendor = require("../models/vendor.model")
const jwt = require("jsonwebtoken")

const adminLogin = (req, res) => {
    const {email, password} = req.body

    admin.findOne({email})
    .then((admin) => {
        if(!admin) {
            res.send({status: false, message: "Invalid credentials."})
        }
        if(admin.password !== password) {
            ers.send({status: false, message: "Invalid credentials"})
        }

        const token = jwt.sign(
            {adminId: admin._id, role: "admin"},
            process.env.JWTsecret,
            {expiresIn: "1h"}
        )
        res.send({status: true, token})
    })
    .catch((err) => {
        console.log(err.message)
    })
}

const verifyAdmin = (req) => {
    const authHeader = req.headers.authorization
    if (!authHeader) return null

    const token = authHeader.split(" ")[1]
    return jwt.verify(token, process.env.JWTsecret)
}

const getVendors = (req, res) => {
    try {
        const decoded = verifyAdmin(req)
        if(!decoded || decoded.role !== "admin") {
            res.send({status: false, message: "Unauthorized."})
        }

        vendor.find()
        .then((vendors) => {
            res.send({status: true, message: vendors})
        })
        .catch((err) => {
            console.log(err.message)
        })
    } catch {
        res.send({status: false, message: "Invalid token."})
    }
}

const deleteVendor = (req, res) => {
    try {
        const decoded = verifyAdmin(req)
        if(!decoded || decoded.role !== "admin") {
            res.send({status: false, message: "Unauthorized."})
        }

        vendor.findByIdAndDelete(req.params._id)
        .then(() => {
            res.send({status: true, message: "Vendor deleted"})
        })
        .catch((err) => {
            console.log(err.message)
        })
    } catch {
        res.send({status: false, message: "Invalid token."})
    }
}

const editVendor = (req, res) => {
    try {
        const decoded = verifyAdmin(req)
        if(!decoded || decoded.role !== "admin") {
            res.send({status: false, message: "Unauthorized."})
        }

        vendor.findByIdAndUpdate(req.params._id, req.body, {new: true})
        .then((vendor) => {
            res.send({status: true, vendor})
        })
        .catch((err) => {
            console.log(err.message)
        })
    } catch {
        res.send({status: false, message: "Invalid token."})
    }
}

module.exports = {adminLogin, getVendors, deleteVendor, editVendor}