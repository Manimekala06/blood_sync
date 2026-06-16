const hospitalController = require("../controllers/hospitalController");
const createCrudRoutes = require("./createCrudRoutes");

module.exports = createCrudRoutes(hospitalController);
