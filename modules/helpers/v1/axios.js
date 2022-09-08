const axios = require("axios");
var qs = require("qs");

module.exports.Myaxios = async (method, data, url, token) => {
  try {
    const Data = qs.stringify(data);
    const axiosConfig = {
      method: method,
      url: url,
      headers: {
        "x-access-token": token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: Data,
    };
    const response = await axios(axiosConfig);
    return response;
  } catch (err) {
    console.log(err);
    return false;
  }
};
module.exports.axios = async (method, data, url, header) => {
  try {
    const Data = qs.stringify(data);
    const axiosConfig = {
      method: method,
      url: url,
      headers: header,
      data: Data,
    };
    const response = await axios(axiosConfig);
    return response;
  } catch (err) {
    console.log(err);
    return false;
  }
};
