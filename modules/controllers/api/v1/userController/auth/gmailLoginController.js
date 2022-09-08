const InitializeController = require("./initializeController");

module.exports = new (class gmailLoginController extends InitializeController {
  async gmailLogin(req, res) {
    try {
      // req.checkBody("token", 2000).notEmpty();
      // req.checkBody("g-recaptcha-response", 132).notEmpty();
      // if (this.helper.showValidationErrors(req, res)) return "";
      // const recaptcha = await this.helper.recaptcha(
      //   req.body["g-recaptcha-response"],
      //   req.headers["x-forwarded-for"] || req.socket.remoteAddress
      // );
      // if (!recaptcha.data.success) return this.helper.response(res, 131);
      // const response = await this.helper.gmailLogin(req.body.token);
      // if (!response) return this.helper.response(res, 2001);
      let values = { email:req.body.email };
      const findUser = await this.model.User.findOne(values).exec();
      // let user = null;
      // if (findUser) {
      //   if (findUser.type != "user") return this.helper.response(res, 2001);
      //   user = findUser;
      // } 
      // else {
        // values = {
        //   ...values,
        //   firstName: response.given_name,
        //   lastName: response.family_name,
          // googleId: response.sub,
        //   type: "user",
        // };
        // user = await this.model.User.create(values);
      // }
      const Transform = await this.helper.transform(
        findUser,
        this.helper.itemTransform,
        false,
        "user",
        req.connection.remoteAddress,
        // req.headers["x-forwarded-for"] || req.socket.remoteAddress,
        req.get("User-Agent")
      );
      return this.helper.response(res, 100, null, Transform);
    } catch (err) {
      console.log(err);
      return this.helper.response(res, 125);
    }
  }
})();
