const BloodRequest = require("../models/BloodRequest");
const createCrudController = require("./crudController");

module.exports = createCrudController(BloodRequest, "Blood request", "requestId");
