const config = require("../../../config");
const { showValidationErrors } = require(`${config.path.helper.v1}/validation`);
const { response } = require(`${config.path.helper.v1}/response`);

module.exports = class Controller {
  constructor() {
    this.helper = { showValidationErrors, response };
  }
};
