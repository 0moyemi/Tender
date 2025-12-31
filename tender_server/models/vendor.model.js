const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

let vendorSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      required: true,
      unique: true
    },

    ownerName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    isApproved: {
      type: Boolean,
      default: true
    }
  },

  { timestamps: true }
)

let saltRound = 10

vendorSchema.pre("save", async function () {
  // Only hash if password changed
  if (!this.isModified("password")) return;

  const hashed = await bcrypt.hash(this.password, saltRound);
  this.password = hashed;
});

vendorSchema.methods.validatePassword = function (password, callback) {
  bcrypt.compare(password, this.password, (err, same) => {
    callback(err, same)
  })
}

module.exports = mongoose.model("Vendors", vendorSchema)