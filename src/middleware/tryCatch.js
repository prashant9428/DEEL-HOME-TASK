/**
 *
 * @param {*} controller
 * @returns
 */

const tryCatch = (controller) => async (req, res, next) => {
  try {
    return await controller(req, res);
  } catch (error) {
    next(error);
  }
};

module.exports = tryCatch;
