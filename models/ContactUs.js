const mongoose = require("mongoose");
const createId = require("../utils/id");

const contactUsSchema = new mongoose.Schema(
  {
    contactId: {
      type: String,
      required: true,
      unique: true,
      default: () => createId("CONT")
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    subject: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now
    }
  },
  {
    versionKey: false
  }
);

module.exports = mongoose.model("ContactUs", contactUsSchema);
