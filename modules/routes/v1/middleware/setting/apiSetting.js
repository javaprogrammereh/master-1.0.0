const settingToken = process.env.SETTING_TOKEN;
const config = require("../../../../config");
const { response } = require(`${config.path.helper.v1}/response`);

module.exports = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (token === settingToken) next();
  else {
    return response(res, 121);
  }
};
