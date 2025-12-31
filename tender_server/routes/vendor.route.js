const express = require("express")
const router = express.Router()
const { signUp, signIn } = require('../controllers/vendor.controller')
const { uploadProduct, getProduct, editProduct, deleteProduct } = require('../controllers/vendordashboard.controller')
const vendorAuth = require("../middlewares/vendorAuth")

router.get("/dashboard/auth", vendorAuth, (req, res) => {
    res.send({status: true})
})

router.post("/signup", signUp)
router.post("/signin", signIn)


router.post("/dashboard", vendorAuth,  uploadProduct)
router.get("/dashboard", vendorAuth, getProduct)
router.put("/dashboard/:_id",vendorAuth, editProduct)
router.delete("/dashboard/:_id",vendorAuth, deleteProduct)

module.exports = router;