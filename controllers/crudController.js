const createCrudController = (Model, resourceName, idField) => ({
  create: async (req, res, next) => {
    try {
      const document = await Model.create(req.body);
      res.status(201).json({
        message: `${resourceName} created successfully`,
        data: document
      });
    } catch (error) {
      next(error);
    }
  },

  getAll: async (req, res, next) => {
    try {
      const documents = await Model.find().sort({ createdAt: -1 });
      res.json({
        count: documents.length,
        data: documents
      });
    } catch (error) {
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      const document = await Model.findOne({ [idField]: req.params.id });

      if (!document) {
        return res.status(404).json({
          message: `${resourceName} not found`
        });
      }

      return res.json({ data: document });
    } catch (error) {
      return next(error);
    }
  },

  updateById: async (req, res, next) => {
    try {
      const document = await Model.findOneAndUpdate(
        { [idField]: req.params.id },
        req.body,
        {
          new: true,
          runValidators: true
        }
      );

      if (!document) {
        return res.status(404).json({
          message: `${resourceName} not found`
        });
      }

      return res.json({
        message: `${resourceName} updated successfully`,
        data: document
      });
    } catch (error) {
      return next(error);
    }
  },

  deleteById: async (req, res, next) => {
    try {
      const document = await Model.findOneAndDelete({ [idField]: req.params.id });

      if (!document) {
        return res.status(404).json({
          message: `${resourceName} not found`
        });
      }

      return res.json({
        message: `${resourceName} deleted successfully`
      });
    } catch (error) {
      return next(error);
    }
  }
});

module.exports = createCrudController;
