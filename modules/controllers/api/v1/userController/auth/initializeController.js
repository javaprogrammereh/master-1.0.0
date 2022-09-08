const config = require("../../../../../config");
const controller = require(`${config.path.controllersApi.v1.controller}`);

const User = require(`${config.path.model}/user`);

const { recaptcha } = require(`${config.path.helper.v1}/recaptcha`);
const { gmailLogin } = require(`${config.path.helper.v1}/google`);
const { transform } = require(`${config.path.helper.v1}/transform`);
const itemTransform = ["._id", ".firstName", ".lastName", ".email", ".type"];
module.exports = class initializeController extends controller {
  constructor() {
    super();
    (this.model = { User }), (this.helper = { ...this.helper, gmailLogin, recaptcha, transform, itemTransform });
  }
};
