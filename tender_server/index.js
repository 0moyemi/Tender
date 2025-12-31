const express = require("express")
const app = express()
require("dotenv").config()
const cors = require("cors")
const mongoose = require("mongoose")
const PORT = process.env.PORT || 4224
const URI = process.env.URI
const vendorRouter = require('./routes/vendor.route')
const marketplaceRouter = require("./routes/marketplace.route")
const adminRouter = require("./routes/admin.route")

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors({
    origin: "https://tender-mvp-ten.vercel.app"
}))
app.use("/vendor", vendorRouter)
app.use("/marketplace", marketplaceRouter)
app.use("/admin", adminRouter)

mongoose.connect(URI)
    .then(() => {
        console.log(`Database connected successfully`)
    })
    .catch((err) => {
        console.log(`Error connecting to database ${err}`)
    })

app.listen(PORT, (err) => {
    if (err) {
        console.log("An error occured.")
    } else {
        console.log(`successfully connected to localhost ${PORT}`)
    }
})