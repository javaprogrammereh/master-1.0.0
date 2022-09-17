const InitializeController = require("./initializeController");

module.exports = new (class registerController extends InitializeController {
  async register(req, res) {
    try {
      req.checkBody("firstName", 220).notEmpty();
      req.checkBody("lastName", 221).notEmpty();
      req.checkBody("email", 222).notEmpty();
      req.checkBody("password", 223).notEmpty();
      req.checkBody("email", 224).isEmail();
      if (this.helper.showValidationErrors(req, res)) return "";
      const superAdmin = await this.model.User.findOne({ email: req.body.email }).exec();
      if (superAdmin) return this.helper.response(res, 225, "email");
      const values = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        type: req.body.type,
        // type: "superAdmin",
      };
      await this.model.User.create(values);
      return this.helper.response(res, 101);
    } catch (err) {
      console.log(err);
      return this.helper.response(res, 125);
    }
  }
})();
//?