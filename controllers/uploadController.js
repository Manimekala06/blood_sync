const { buildFileResponse } = require("../config/upload");

const uploadSingle = (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      message: "File is required"
    });
  }

  return res.status(201).json({
    message: "File uploaded successfully",
    data: buildFileResponse(req, req.file)
  });
};

module.exports = {
  uploadSingle
};
