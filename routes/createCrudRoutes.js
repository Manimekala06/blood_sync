const express = require("express");

const createCrudRoutes = (controller) => {
  const router = express.Router();

  router.route("/")
    .post(controller.create)
    .get(controller.getAll);

  router.route("/:id")
    .get(controller.getById)
    .put(controller.updateById)
    .delete(controller.deleteById);

  return router;
};

module.exports = createCrudRoutes;
