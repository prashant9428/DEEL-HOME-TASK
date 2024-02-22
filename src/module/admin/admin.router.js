const express = require("express");
const tryCatch = require("../../middleware/tryCatch");

const router = express.Router();
const { getbestClients , getbestProfession} = require("./admin.controller");

router.get("/best-profession", tryCatch(getbestProfession));
router.get("/best-clients", tryCatch(getbestClients));

module.exports = router;
