const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const createId = require("../utils/id");

const donorSchema = new mongoose.Schema(
  {
    donorId: {
      type: String,
      required: true,
      unique: true,
      default: () => createId("DONOR")
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    age: {
      type: Number,
      required: true,
      min: 18
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female", "other"]
    },
    bloodGroup: {
      type: String,
      required: true,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
    },
    weight: {
      type: Number,
      required: true,
      min: 1
    },
    height: {
      type: Number,
      min: 1
    },
    address: {
      type: String,
      trim: true
    },
    medicalCertificate: {
      type: String,
      required: true,
      trim: true
    },
    drugHistory: {
      type: Boolean,
      required: true
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "approved", "rejected", "inactive"],
      default: "pending"
    },
    availabilityStatus: {
      type: String,
      required: true,
      enum: ["available", "unavailable"],
      default: "available"
    },
    lastDonationDate: {
      type: Date
    },
    nextEligibleDate: {
      type: Date
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now
    }
  },
  {
    versionKey: false,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        return ret;
      }
    }
  }
);

donorSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  return next();
});

donorSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("Donor", donorSchema);
