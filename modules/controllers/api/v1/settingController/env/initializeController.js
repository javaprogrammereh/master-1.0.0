const config = require("../../../../../config");
const controller = require(`${config.path.controllersApi.v1.controller}`);

const Env = require(`${config.path.model}/env`);

module.exports = class initializeController extends controller {
  constructor() {
    super();
    this.model = { Env };
  }
};
