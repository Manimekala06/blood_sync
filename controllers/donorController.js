const bcrypt = require("bcryptjs");
const { buildFileResponse } = require("../config/upload");
const createCrudController = require("./crudController");
const Donor = require("../models/Donor");

const baseController = createCrudController(Donor, "Donor", "donorId");

const create = async (req, res, next) => {
  try {
    const payload = { ...req.body };

    if (req.file) {
      payload.medicalCertificate = buildFileResponse(req, req.file).path;
    }

    const donor = await Donor.create(payload);

    return res.status(201).json({
      message: "Donor created successfully",
      data: donor
    });
  } catch (error) {
    return next(error);
  }
};

const updateById = async (req, res, next) => {
  try {
    const payload = { ...req.body };

    if (req.file) {
      payload.medicalCertificate = buildFileResponse(req, req.file).path;
    }

    if (payload.password) {
      payload.password = await bcrypt.hash(payload.password, 10);
    }

    const donor = await Donor.findOneAndUpdate(
      { donorId: req.params.id },
      payload,
      {
        new: true,
        runValidators: true
      }
    );

    if (!donor) {
      return res.status(404).json({
        message: "Donor not found"
      });
    }

    return res.json({
      message: "Donor updated successfully",
      data: donor
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  ...baseController,
  create,
  updateById
};
