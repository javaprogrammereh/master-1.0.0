const releasesV = process.env.RELEASES_V;
const persianResponse = require("../../../responseMessage/persian.json");
module.exports.response = async (res, code, field = null, data = null) => {
  let message = null;
  let status = null;
  if (ln === "persian") {
    status = Number(persianResponse[code].status);
    message = persianResponse[code].message;
  }
  let success = false;
  if (status === 200 || status === 201) success = true;
  return res.status(status).json({
    message: {
      field: field,
      message,
      logcode,
      status: code,
    },
    status,
    success,
    data,
    v: releasesV,
  });
};
