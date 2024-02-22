const { Op } = require("sequelize");
const { successResponse, BadRequestError } = require("../../utils/response");

/**
 * !Deposits money into the the the balance of a client, 
 * !a client can't deposit more than 25% his total of jobs to pay. (at the deposit moment)
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.deposit = async function (req, res) {
  const { Job, Contract, Profile } = req.app.get("models");
  const clientId = req.params.userId;
  const depositAmount = req.body.amount;
  const sequelize = req.app.get("sequelize");
  const depositTransaction = await sequelize.transaction();
  let response;

  try {
    const client = await Profile.findByPk(clientId, {
      transaction: depositTransaction,
    });
    if (client.dataValues.type != "client")
      throw new BadRequestError("Deposit is only available for clients");

    const totalJobsToPay = await Job.findAll(
      {
        attributes: {
          include: [
            [sequelize.fn("SUM", sequelize.col("price")), "totalPrice"],
          ],
        },
        include: [
          {
            model: Contract,
            as: "Contract",
            where: {
              ClientId: clientId,
              status: "in_progress",
            },
          },
        ],
        where: {
          paid: null,
        },
        raw: true,
      },
      { transaction: depositTransaction }
    );

    const { totalPrice } = totalJobsToPay[0];
    if (totalPrice == null) throw new BadRequestError("No unpaid orders found");

    const depositThreshold = totalPrice * 0.25;
    if (depositAmount > depositThreshold) {
      response = `Maximum deposit amount reached. Deposit ${depositAmount} is more than 25% of current jobs. You can max deposit ${depositThreshold}`;
    } else {
      await client.increment(
        { balance: depositAmount },
        { transaction: depositTransaction }
      );

      client.balance += depositAmount;
      await depositTransaction.commit();
      response = client;
    }

    return successResponse(res,"success",response)
  } catch (error) {
    console.debug("Error",error)
    await depositTransaction.rollback();
    if (error.status == 400) {
      throw new BadRequestError(error.message);
    } else {
      throw new Error("Please try depostitng again");
    }
  }
};
