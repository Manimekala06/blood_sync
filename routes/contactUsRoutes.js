const express = require("express");
const contactUsController = require("../controllers/contactUsController");
const { authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/")
  .post(contactUsController.create)
  .get(authorize("admin"), contactUsController.getAll);

router.route("/:id")
  .get(authorize("admin"), contactUsController.getById)
  .delete(authorize("admin"), contactUsController.deleteById);

module.exports = router;
