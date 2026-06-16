const bloodRequestController = require("../controllers/bloodRequestController");
const createCrudRoutes = require("./createCrudRoutes");

module.exports = createCrudRoutes(bloodRequestController);
