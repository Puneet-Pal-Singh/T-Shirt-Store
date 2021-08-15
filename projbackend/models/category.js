const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true, // like required field
      maxlength: 32,
      unique: true, // name should be unique
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
