const { NotFoundError } = require("../utils/response");

const pageNotFound = (req, res, next) => {
  throw new NotFoundError("Page Not Found");
};

module.exports = pageNotFound;
