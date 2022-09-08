const axios = require("axios");
const Env = require("../../models/env");
var qs = require("qs");

module.exports.sendIpSms = async (type, data) => {
  try {
    let Data = null;
    const env = await Env.findOne({ type: "sendIpSms" }).exec();
    if (!env) return false;
    const getTokenData = qs.stringify({
      UserApiKey: env.object.apiKey,
      SecretKey: env.object.secretKey,
    });
    const getTokenConfig = {
      method: "post",
      url: env.object.getTokenUrl,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: getTokenData,
    };
    const getTokenResponse = await axios(getTokenConfig);
    if (type === "loginOrRegister") {
      Data = JSON.stringify({
        ParameterArray: [
          {
            Parameter: "VerificationCode",
            ParameterValue: data.code,
          },
        ],
        Mobile: data.mobile,
        TemplateId: env.object.templates.loginOrRegister,
      });
    }
    const config = {
      method: "post",
      url: env.object.url,
      headers: {
        "Content-Type": "application/json",
        "x-sms-ir-secure-token": getTokenResponse.data.TokenKey,
      },
      data: Data,
    };
    const response = await axios(config);
    return response;
  } catch (err) {
    console.log(err);
    return false;
  }
};
