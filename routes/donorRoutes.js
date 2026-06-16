const express = require("express");
const donorController = require("../controllers/donorController");
const { upload } = require("../config/upload");

const router = express.Router();

router.route("/")
  .post(upload.single("medicalCertificate"), donorController.create)
  .get(donorController.getAll);

router.route("/:id")
  .get(donorController.getById)
  .put(upload.single("medicalCertificate"), donorController.updateById)
  .delete(donorController.deleteById);

module.exports = router;
