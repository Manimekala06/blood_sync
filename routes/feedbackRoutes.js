const feedbackController = require("../controllers/feedbackController");
const createCrudRoutes = require("./createCrudRoutes");

module.exports = createCrudRoutes(feedbackController);
