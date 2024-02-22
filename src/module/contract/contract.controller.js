const { Op } = require("sequelize");
const { successResponse, NotFoundError } = require("../../utils/response");

/**
 * !it should return the contract only if it belongs to the profile calling
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.getContractsById = async function (req, res) {
  const { Contract, Profile } = req.app.get("models");
  const { id } = req.params;
  const profileId = req.profile.id;
  const contract = await Contract.findOne({
    where: {
      id: id,
      [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
    },
    include: [
      {
        model: Profile,
        as: "Contractor",
        attributes: ["id", "firstName", "lastName", "profession", "type"],
      },
      {
        model: Profile,
        as: "Client",
        attributes: ["id", "firstName", "lastName", "profession", "type"],
      },
    ],
  });
  if (!contract) throw new NotFoundError("Contract not found");
  return successResponse(res, "success", contract);
};

/**
 * !Returns a list of contracts belonging to a user (client or contractor),
 * !the list should only contain non terminated contracts.
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.getNonTerminatedProfileContracts = async function (req, res) {
  const { Contract, Profile } = req.app.get("models");
  const profileId = req.profile.id;
  const contracts = await Contract.findAll({
    where: {
      status: {
        [Op.ne]: "terminated",
      },
      [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
    },
    include: [
      {
        model: Profile,
        as: "Client",
        attributes: ["id", "firstName", "lastName", "profession", "type"],
      },
    ],
  });
  return successResponse(res, "success", contracts);
};
