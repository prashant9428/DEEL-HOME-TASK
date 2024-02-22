const express = require("express");
const { getProfile } = require("../../middleware/getProfile");
const tryCatch = require("../../middleware/tryCatch");

const router = express.Router();
const { getUnpaidJobs,payForJob } = require("./job.controller");

router.post("/:job_id/pay", getProfile, tryCatch(payForJob));
router.get("/unpaid", getProfile, tryCatch(getUnpaidJobs));


module.exports = router;
