const InitializeController = require("./initializeController");
const crypto = require("crypto");

module.exports = new (class storeController extends InitializeController {
  async store(req, res) {
    try {
      req.checkBody("type", 200).notEmpty();
      req.checkBody("type", 201).isIn(["hashPassword", "sendIpSms", "jwtRegisterUser"]);
      if (this.helper.showValidationErrors(req, res)) return;
      let object = {};
      if (req.body.type == "hashPassword") {
        req.checkBody("algorithm", 202).notEmpty();
        if (this.helper.showValidationErrors(req, res)) return;
        object = {
          algorithm: req.body.algorithm,
          initVector: crypto.randomBytes(16).toString("base64"),
          securitykey: crypto.randomBytes(32).toString("base64"),
        };
      }
      if (req.body.type == "sendIpSms") {
        req.checkBody("apiKey", 205).notEmpty();
        req.checkBody("secretKey", 206).notEmpty();
        req.checkBody("getTokenUrl", 207).notEmpty();
        req.checkBody("url", 208).notEmpty();
        req.checkBody("templates", 209).notEmpty();
        if (this.helper.showValidationErrors(req, res)) return;
        let templates = null;
        try {
          templates = JSON.parse(req.body.templates);
        } catch (err) {
          return this.helper.response(res, 210, "templates");
        }
        object = {
          apiKey: req.body.apiKey,
          secretKey: req.body.secretKey,
          getTokenUrl: req.body.getTokenUrl,
          url: req.body.url,
          templates,
        };
      }
      if (req.body.type == "jwtRegisterUser") {
        req.checkBody("key", 204).notEmpty();
        req.checkBody("algorithm", 202).notEmpty();
        if (this.helper.showValidationErrors(req, res)) return;
        object = {
          key: req.body.key,
          algorithm: req.body.algorithm,
        };
      }
      await this.model.Env.create({ type: req.body.type, object });
      return this.helper.response(res, 101);
    } catch (err) {
      if (err.code == 11000) return this.helper.response(res, 203, "type");
      console.log(err);
      return this.helper.response(res, 125);
    }
  }
})();
