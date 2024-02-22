const { Op } = require("sequelize");
const { successResponse, BadRequestError } = require("../../utils/response");

/**
 * !Returns the profession that earned the most money (sum of jobs paid) 
 * !for any contactor that worked in the query time
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.getbestProfession = async function (req, res) {
  const { Job, Contract, Profile } = req.app.get("models");
  const startDate = new Date(req.query.startDate);
  const endDate = new Date(req.query.endDate);
  const sequelize = req.app.get("sequelize");

  // Compare startDate and endDate
  if (startDate > endDate) {
    throw new BadRequestError("startDate cannot be greater than endDate");
  }

  if (endDate < startDate) {
    throw new BadRequestError("endDate cannot be smaller than startDate");
  }

  const bestProfession = await Profile.findAll({
    include: [
      {
        model: Contract,
        as: "Contractor",
        include: [
          {
            model: Job,
            where: {
              paid: 1,
              paymentDate: {
                [Op.between]: [startDate, endDate],
              },
            },
          },
        ],
      },
    ],
    where: {
      type: "contractor",
    },
    // group:["profession"],
    // order: [[sequelize.col('paid'), 'DESC']],
    attributes: [
      "profession",
      [sequelize.fn("SUM", sequelize.col("price")), "total_amount"],
    ],
    group: ["profession"],
    order: [[sequelize.col("total_amount"), "DESC"]],
  });

  return successResponse(res, "success", {
    bestProfession:
      bestProfession.length > 0 ? bestProfession[0].profession : null,
  });
};

/**
 * !returns the clients the paid the most for jobs in the query time period. 
 * !limit query parameter should be applied, default limit is 2.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.getbestClients = async function (req, res) {
  const { Job, Contract, Profile } = req.app.get("models");
  const startDate = new Date(req.query.startDate);
  const endDate = new Date(req.query.endDate);
  const limit = req.query.limit || 2;
  const sequelize = req.app.get("sequelize");

  if (startDate > endDate) {
    throw new BadRequestError("startDate cannot be greater than endDate");
  }

  if (endDate < startDate) {
    throw new BadRequestError("endDate cannot be smaller than startDate");
  }

  let bestClient = await Profile.findAll({
    where: {
      type: "client", // Filter by client profiles
    },
    attributes: [
      "id",
      [
        sequelize.fn(
          "concat",
          sequelize.col("firstName"),
          " ",
          sequelize.col("lastName")
        ),
        "fullName",
      ],
      [sequelize.fn("SUM", sequelize.col("Client.Jobs.price")), "paid"], // Sum of totalPrice for all jobs associated with client contracts
    ],
    include: [
      {
        model: Contract,
        as: "Client",
        include: [
          {
            model: Job,
            where: {
              paid: 1,
              paymentDate: {
                [Op.between]: [startDate, endDate],
              },
            },
          },
        ],
      },
    ],
    group: ["Profile.id"],
    order: [[sequelize.col("paid"), "DESC"]],
    raw: true,
  });

  bestClient = bestClient.map((item) => {
    return { id: item.id, fullName: item.fullName, paid: item.paid };
  });

  return successResponse(res, "success", bestClient.slice(0,limit));
};
