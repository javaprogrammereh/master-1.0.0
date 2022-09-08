const config = require("../../../../config");
const User = require(`${config.path.model}/user`);
const Token = require(`${config.path.model}/token`);
const { response } = require(`${config.path.helper.v1}/response`);

module.exports = async (req, res, next) => {
  try {
    const token = await Token.findOne({ token: req.headers["x-access-token"] }).exec();
    if (!token) return response(res, 121);
    const user = await User.findOne({ _id: token.userId }).exec();
    if (!user) return response(res, 121);
    // const date = new Date();
    // if (token.liveTime < date) {
    //   await Token.findByIdAndRemove(token._id).exec();
    //   return response(res, 121);
    // } else {
    //   let values = {};
    //   const hours = Math.abs(token.liveTime - date) / 36e5;
    //   if (hours <= 1) {
    //     let liveTime = token.liveTime;
    //     liveTime.setHours(liveTime.getHours() + 5);
    //     values = { ...values, liveTime };
    //   }
    //   if (token.lastIp != req.connection.remoteAddress) values = { ...values, lastIp: req.connection.remoteAddress };
    //   await Token.findByIdAndUpdate(token._id, values).exec();
    //   user.tokenId = token._id;
    //   req.user = user;
    //   next();
    // }
    user.tokenId = token._id;
    req.user = user;
    next();
  } catch (err) {
    return response(res, 121);
  }
};
