const express = require("express");
const { getProfile } = require("../../middleware/getProfile");
const tryCatch = require("../../middleware/tryCatch");

const router = express.Router();
const { getContractsById, getNonTerminatedProfileContracts} = require("./contract.controller");

router.get("/", getProfile, tryCatch(getNonTerminatedProfileContracts));
router.get("/:id", getProfile, tryCatch(getContractsById));

module.exports = router;
