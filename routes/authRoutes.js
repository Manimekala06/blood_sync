const express = require("express");
const authController = require("../controllers/authController");
const { upload } = require("../config/upload");

const router = express.Router();

router.post("/register/donor", upload.single("medicalCertificate"), authController.registerDonor);
router.post("/register/hospital", authController.registerHospital);
router.post("/register/admin", authController.registerAdmin);
router.post("/login", authController.login);

module.exports = router;
