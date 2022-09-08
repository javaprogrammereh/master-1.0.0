const webHookToken = process.env.WEBHOOK_TOKEN;
const config = require("../../../../config");
const { response } = require(`${config.path.helper.v1}/response`);

module.exports = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (token === webHookToken) next();
  else {
    return response(res, 121);
  }
};
//;
