const mongoose = require("mongoose")

let adminSchema = new mongoose.Schema(
    {
    email: String,
    password: String,
  },

  { timestamps: true }
)

module.exports = mongoose.model("Admin", adminSchema)