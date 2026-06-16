const Feedback = require("../models/Feedback");
const createCrudController = require("./crudController");

module.exports = createCrudController(Feedback, "Feedback", "feedbackId");
