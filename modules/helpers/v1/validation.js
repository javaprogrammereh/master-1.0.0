const releasesV = process.env.RELEASES_V;
const persianResponse = require("../../../responseMessage/persian.json");
module.exports.showValidationErrors = (req, res) => {
  const errors = req.validationErrors();
  if (errors) {
    errors.forEach((error) => {
      let message = null;
      if (ln === "persian") message = persianResponse[error.msg].message;
      error.status = error.msg;
      error.msg = message;
    });
    res.status(422).json({
      messages: errors.map((error) => ({
        field: error.param,
        message: error.msg,
        status: error.status,
      })),
      logcode,
      success: false,
      status: 422,
      v: releasesV,
    });
    return true;
  }
  return false;
};
