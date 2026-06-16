const notificationController = require("../controllers/notificationController");
const createCrudRoutes = require("./createCrudRoutes");

module.exports = createCrudRoutes(notificationController);
