const getProfile = async (req, res, next) => {
  const { Profile } = req.app.get("models");
  const profile = await Profile.findOne({
    where: { id: req.get("profile_id") || 0 },
    raw: true,
  });
  if (!profile) return res.status(401).send("unauthorized").end();
  req.profile = profile;
  next();
};
module.exports = { getProfile };
