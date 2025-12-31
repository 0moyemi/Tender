const express = require("express")
const router = express.Router()
const {adminLogin, getVendors, deleteVendor, editVendor} = require("../controllers/admin.controller")

router.post("/login", adminLogin)
router.get("/vendors", getVendors)
router.put("/vendors/:id", editVendor)
router.delete("/vendors/:id", deleteVendor)

module.exports = router;