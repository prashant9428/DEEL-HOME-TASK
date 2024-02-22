const { Router } = require("express");
const router = Router();
// modules routers
const contractRouter = require("./contract/contract.router");
const jobRouter = require("./job/job.router");
const profileRouter = require("./profile/profile.router");
const adminRouter = require("./admin/admin.router");

router.use("/contracts", contractRouter);
router.use("/jobs", jobRouter);
router.use("/balances", profileRouter);
router.use("/admin", adminRouter);

module.exports = router;
