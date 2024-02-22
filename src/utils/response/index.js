const {
  HttpError,
  BadRequestError,
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
} = require("./error");

/**
 *
 * @param {*} res
 * @param {*} message
 * @param {*} resbody
 * @param {*} code
 * @returns
 */
const successResponse = (res, message, resbody, code = 200, statusId = 1) =>
  res.status(code).send({
    statusId,
    message,
    data: resbody,
  });

module.exports = {
  HttpError,
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
  successResponse,
};
