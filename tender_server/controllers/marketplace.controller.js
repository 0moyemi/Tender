const express = require('express')
const productsModel = require('../models/products.model')

const getAllProducts = (req, res) => {
    productsModel.find()
        .then((products) => {
            // Add vendor name to each product
            const productsWithVendor = products.map(product => {
                return {
                    ...product._doc,
                    vendorName: product.vendorId && product.vendorId.name ? product.vendorId.name : null
                };
            });
            res.send({ status: true, message: productsWithVendor })
        })
        .catch((err) => {
            res.send({ status: false, message: err.message })
        })
}

const getSingleProduct = (req, res) => {
    const { _id } = req.params

    productsModel.findById(_id)
        .then((product) => {
            if (!product) {
                return res.send({ status: false, message: "Product not found." })
            }
            // Add vendor name to product
            const productWithVendor = {
                ...product._doc,
                vendorName: product.vendorId && product.vendorId.name ? product.vendorId.name : null
            };
            res.send({ status: true, product: productWithVendor })
        })
        .catch((err) => {
            res.send({ status: false, message: err.message })
        })
}

module.exports = { getAllProducts, getSingleProduct }