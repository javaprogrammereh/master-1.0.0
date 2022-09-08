const config = require("../../../config");
const express = require("express");
const router = express.Router();
// middleware
const apiSetting = require("../middleware/setting/apiSetting");
//  Controllers
const { setting: settingController } = config.path.controllersApi.v1;
/// Controller
// superAdmin
const superAdminRegisterController = require(`${settingController}/superAdmin/registerController`);
//env
const envStoreController = require(`${settingController}/env/storeController`);
///Router

// *superAdmin
const superAdminRouter = express.Router();
superAdminRouter.post("/register", superAdminRegisterController.register.bind(superAdminRegisterController));
router.use("/superAdmin", superAdminRouter);
// env
const envRouter = express.Router();
envRouter.post("/store", envStoreController.store.bind(envStoreController));
router.use("/env", apiSetting, envRouter);
module.exports = router;
///