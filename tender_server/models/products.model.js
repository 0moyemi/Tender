const mongoose = require("mongoose")

let productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    price: {
      type: Number,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    category: {
      type: String,
      required: true
    },

    features: {
      type: [String],
      validate: {
        validator: v => v.length >= 2,
        message: "At least 2 features required"
      }
    },

    image: { type: String },

    vendorId: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "vendors",
        required: true
      },
      name: {
        type: String,
        required: true
      }
    }
  },

  { timestamps: true }
)

module.exports = mongoose.model("Products", productSchema)