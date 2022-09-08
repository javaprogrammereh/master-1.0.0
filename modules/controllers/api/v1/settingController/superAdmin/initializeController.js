const config = require("../../../../../config");
const controller = require(`${config.path.controllersApi.v1.controller}`);
const User = require(`${config.path.model}/user`);

module.exports = class initializeController extends controller {
  constructor() {
    super();
    this.model = { User };
  }
};
