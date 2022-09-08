const path = require("path");

module.exports = {
  path: {
    controllersApi: {
      v1: {
        public: path.resolve("./modules/controllers/api/v1/publicController"),
        superAdmin: path.resolve("./modules/controllers/api/v1/superAdminController"),
        user: path.resolve("./modules/controllers/api/v1/userController"),
        webHook: path.resolve("./modules/controllers/api/v1/webHookController"),
        setting: path.resolve("./modules/controllers/api/v1/settingController"),
        // share: path.resolve("./modules/controllers/api/v1/shareController"),
        controller: path.resolve("./modules/controllers/api/v1/controller"),
      },
    },
    helper: {
      v1: path.resolve("./modules/helpers/v1"),
    },
    model: path.resolve("./modules/models"),
  },
};
