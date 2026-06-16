const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const loginSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      enum: ["donor", "hospital", "admin"]
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      select: false
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

loginSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  return next();
});

loginSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("Login", loginSchema);
