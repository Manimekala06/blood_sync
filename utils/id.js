const { randomUUID } = require("crypto");

const createId = (prefix) => `${prefix}-${randomUUID()}`;

module.exports = createId;
