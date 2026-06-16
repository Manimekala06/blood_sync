const Donor = require("../models/Donor");
const Hospital = require("../models/Hospital");
const Login = require("../models/Login");
const { buildFileResponse } = require("../config/upload");
const { createToken } = require("../utils/auth");

const roleModels = {
  donor: {
    model: Donor,
    idField: "donorId",
    nameField: "name"
  },
  hospital: {
    model: Hospital,
    idField: "hospitalId",
    nameField: "hospitalName"
  },
  admin: {
    model: Login,
    idField: "_id",
    nameField: "email"
  }
};

const registerDonor = async (req, res, next) => {
  try {
    const payload = { ...req.body };

    if (req.file) {
      payload.medicalCertificate = buildFileResponse(req, req.file).path;
    }

    const donor = await Donor.create(payload);
    await Login.create({
      role: "donor",
      email: payload.email,
      password: payload.password
    });

    res.status(201).json({
      message: "Donor registered successfully",
      data: donor
    });
  } catch (error) {
    next(error);
  }
};

const registerHospital = async (req, res, next) => {
  try {
    const hospital = await Hospital.create(req.body);
    await Login.create({
      role: "hospital",
      email: req.body.email,
      password: req.body.password
    });

    res.status(201).json({
      message: "Hospital registered successfully",
      data: hospital
    });
  } catch (error) {
    next(error);
  }
};

const registerAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "email and password are required"
      });
    }

    const admin = await Login.create({
      role: "admin",
      email,
      password
    });

    return res.status(201).json({
      message: "Admin registered successfully",
      data: admin
    });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { role, email, password } = req.body;

    if (!role || !email || !password) {
      return res.status(400).json({
        message: "role, email and password are required"
      });
    }

    const roleConfig = roleModels[role];

    if (!roleConfig) {
      return res.status(400).json({
        message: "role must be donor, hospital or admin"
      });
    }

    const account = await roleConfig.model
      .findOne({ email: email.toLowerCase(), ...(role === "admin" ? { role } : {}) })
      .select("+password");

    if (!account || !(await account.comparePassword(password))) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const token = createToken({
      role,
      id: account[roleConfig.idField].toString(),
      email: account.email
    });

    return res.json({
      message: "Login successful",
      token,
      data: {
        role,
        id: account[roleConfig.idField].toString(),
        name: account[roleConfig.nameField],
        email: account.email
      }
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  login,
  registerAdmin,
  registerDonor,
  registerHospital
};
