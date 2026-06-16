const mongoose = require("mongoose");
const createId = require("../utils/id");

const bloodRequestSchema = new mongoose.Schema(
  {
    requestId: {
      type: String,
      required: true,
      unique: true,
      default: () => createId("REQ")
    },
    hospitalId: {
      type: String,
      required: true,
      trim: true
    },
    bloodGroup: {
      type: String,
      required: true,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
    },
    unitsRequired: {
      type: Number,
      required: true,
      min: 1
    },
    patientName: {
      type: String,
      required: true,
      trim: true
    },
    urgency: {
      type: String,
      required: true,
      enum: ["low", "medium", "high", "critical"]
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      required: true,
      enum: ["open", "matched", "fulfilled", "cancelled"],
      default: "open"
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

module.exports = mongoose.model("BloodRequest", bloodRequestSchema);
