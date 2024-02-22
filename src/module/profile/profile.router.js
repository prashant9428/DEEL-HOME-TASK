const express = require("express");
const tryCatch = require("../../middleware/tryCatch");

const router = express.Router();
const { deposit } = require("./profile.controller");

router.post("/deposit/:userId", tryCatch(deposit));

module.exports = router;
