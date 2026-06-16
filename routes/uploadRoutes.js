const express = require("express");
const uploadController = require("../controllers/uploadController");
const { upload } = require("../config/upload");

const router = express.Router();

router.post("/single", upload.single("file"), uploadController.uploadSingle);
router.post(
  "/medical-certificate",
  upload.single("medicalCertificate"),
  uploadController.uploadSingle
);

module.exports = router;
