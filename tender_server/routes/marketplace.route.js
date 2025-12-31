const express = require("express")
const router = express.Router()
const {getAllProducts, getSingleProduct} = require('../controllers/marketplace.controller')

router.get("/products", getAllProducts)
router.get("/products/:_id", getSingleProduct)

module.exports = router;