const bcrypt = require("bcryptjs");
const createCrudController = require("./crudController");
const Login = require("../models/Login");

const baseController = createCrudController(Login, "Login record", "_id");

const updateById = async (req, res, next) => {
  try {
    const payload = { ...req.body };

    if (payload.password) {
      payload.password = await bcrypt.hash(payload.password, 10);
    }

    const login = await Login.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true
    });

    if (!login) {
      return res.status(404).json({
        message: "Login record not found"
      });
    }

    return res.json({
      message: "Login record updated successfully",
      data: login
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  ...baseController,
  updateById
};
