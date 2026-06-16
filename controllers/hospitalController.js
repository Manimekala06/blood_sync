const bcrypt = require("bcryptjs");
const createCrudController = require("./crudController");
const Hospital = require("../models/Hospital");

const baseController = createCrudController(Hospital, "Hospital", "hospitalId");

const updateById = async (req, res, next) => {
  try {
    const payload = { ...req.body };

    if (payload.password) {
      payload.password = await bcrypt.hash(payload.password, 10);
    }

    const hospital = await Hospital.findOneAndUpdate(
      { hospitalId: req.params.id },
      payload,
      {
        new: true,
        runValidators: true
      }
    );

    if (!hospital) {
      return res.status(404).json({
        message: "Hospital not found"
      });
    }

    return res.json({
      message: "Hospital updated successfully",
      data: hospital
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  ...baseController,
  updateById
};
