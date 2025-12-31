const express = require('express')
const productsModel = require('../models/products.model')
const vendorModel = require('../models/vendor.model');

// const jwt = require("jsonwebtoken")
// const getTokenFromHeader = (req) => {
//     const authHeader = req.headers && (req.headers.authorization || req.headers.Authorization)
//     if (!authHeader) return null
//     // Accept both "Bearer <token>" and bare token
//     return authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader
// }

const uploadProduct = (req, res) => {
    const vendorId = req.vendorId;
    const { name, price, description, image, category, features } = req.body;

    if (!Array.isArray(features) || features.length < 2) {
        return res.status(400).send({ status: false, message: 'Please provide at least 2 key features.' })
    }

    // Fetch vendor from DB to get businessName
    vendorModel.findById(vendorId)
        .then((vendor) => {
            if (!vendor) {
                return res.status(400).send({ status: false, message: 'Vendor not found.' });
            }
            const product = new productsModel({
                name,
                price,
                description,
                image,
                category,
                features,
                vendorId: { id: vendor._id, name: vendor.businessName }
            });
            return product.save();
        })
        .then(() => {
            res.send({ status: true, message: "The product has been saved." });
        })
        .catch((err) => {
            res.send({ status: false, message: err.message });
        });
}

const getProduct = (req, res) => {
    const vendorId = req.vendorId;
    productsModel.find({ "vendorId.id": vendorId })
        .then((products) => {
            res.send({ status: true, products });
        })
        .catch((err) => {
            res.send({ status: false, message: err.message });
        });
}

const deleteProduct = (req, res) => {
    const { _id } = req.params
    productsModel.findByIdAndDelete(_id)
        .then(() => {
            res.send({ status: true, message: "Product deleted." })
        })
        .catch((err) => {
            res.send({ status: false, message: err.message })
        })
}

const editProduct = (req, res) => {
    const { _id } = req.params
    productsModel.findByIdAndUpdate(_id, req.body, { new: true })
        .then(() => {
            res.send({ status: true, message: "Product updated." })
        })
        .catch((err) => {
            res.send({ status: false, message: err.message })
        })
}


module.exports = { uploadProduct, getProduct, editProduct, deleteProduct }