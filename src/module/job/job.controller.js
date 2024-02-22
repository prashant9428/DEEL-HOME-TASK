const { Op } = require("sequelize");
const {
  successResponse,
  BadRequestError,
} = require("../../utils/response");
/**
 * !Get all unpaid jobs for a user (either a client or contractor), for active contracts only.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.getUnpaidJobs = async function (req, res) {
  const { Contract, Job } = req.app.get("models");
  const profileId = req.profile.id;
  const jobs = await Job.findAll({
    where: {
      paid: null, // filter unpaid jobs
    },
    include: [
      {
        model: Contract,
        as: "Contract",
        where: {
          status: "in_progress",
          [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
        },
      },
    ],
  });

  return successResponse(res, "success", jobs);
};

/**
 * !client can only pay for jobs
 * !if his balance is greater than amout to pay
 * !amount should move to clients balance to contractor balance
 * @param {*} req
 * @param {*} res
 */
exports.payForJob = async function (req, res) {
  const { Contract, Job, Profile } = req.app.get("models");
  const { job_id } = req.params;
  const sequelize = req.app.get("sequelize");
  const { id: ClientId, balance, type } = req.profile;
  let response;

  if (type != "client")
    throw new BadRequestError("Client can only make the payment");
  const job = await Job.findOne({
    where: {
      [Op.and]: [{ id: job_id }, { paid: null }],
    },
    include: [
      {
        model: Contract,
        as: "Contract",
        where: {
          status: "in_progress",
          ClientId,
        },
      },
    ],
  });
  if (!job) throw new BadRequestError("Not a valid job");

  if (balance < job.price)
    throw new BadRequestError(
      "you do not have enough money to make this transaction"
    );
  const paymentTransaction = await sequelize.transaction();
  const amountForPayment = job.price;
  const contractorId = job.Contract.ContractorId;
  try {
    await Promise.all([
      Profile.update(
        { balance: sequelize.literal(`balance - ${amountForPayment}`) },
        { where: { id: ClientId } },
        { transaction: paymentTransaction }
      ),

      Profile.update(
        { balance: sequelize.literal(`balance + ${amountForPayment}`) },
        { where: { id: contractorId } },
        { transaction: paymentTransaction }
      ),

      Job.update(
        { paid: 1, paymentDate: new Date() },
        { where: { id: job_id } },
        { transaction: paymentTransaction }
      ),
    ]);
    await paymentTransaction.commit();
    response = `Payment of amount ${amountForPayment} has been made successfully.`;
  } catch (error) {
    await paymentTransaction.rollback();
    response = `Payment of amount ${amountForPayment} failed. Please try again.`;
  }

  return successResponse(res, "success", response);
};
