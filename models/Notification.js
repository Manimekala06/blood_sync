const mongoose = require("mongoose");
const createId = require("../utils/id");

const notificationSchema = new mongoose.Schema(
  {
    notificationId: {
      type: String,
      required: true,
      unique: true,
      default: () => createId("NOTIF")
    },
    donorId: {
      type: String,
      required: true,
      trim: true
    },
    requestId: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    notificationStatus: {
      type: String,
      required: true,
      enum: ["unread", "read"],
      default: "unread"
    },
    userStatus: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending"
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

module.exports = mongoose.model("Notification", notificationSchema);
