const mongoose = require("mongoose");
const createId = require("../utils/id");

const feedbackSchema = new mongoose.Schema(
  {
    feedbackId: {
      type: String,
      required: true,
      unique: true,
      default: () => createId("FDBK")
    },
    donorId: {
      type: String,
      required: true,
      trim: true
    },
    hospitalId: {
      type: String,
      required: true,
      trim: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
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

module.exports = mongoose.model("Feedback", feedbackSchema);
