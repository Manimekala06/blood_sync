const ContactUs = require("../models/ContactUs");
const createCrudController = require("./crudController");

module.exports = createCrudController(ContactUs, "Contact message", "contactId");
