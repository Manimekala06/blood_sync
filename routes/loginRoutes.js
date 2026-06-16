const loginController = require("../controllers/loginController");
const createCrudRoutes = require("./createCrudRoutes");

module.exports = createCrudRoutes(loginController);
