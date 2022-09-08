const config = require("../../../config");
const express = require("express");
const router = express.Router();
// middleware
const apiWebHook = require("../middleware/webHook/apiWebHook");
//  Controllers
const { webHook: webHookController } = config.path.controllersApi.v1;
/// Controller

//product
const productStoreController = require(`${webHookController}/product/storeController`);
///Router

// *product
const productRouter = express.Router();
productRouter.post("/store", productStoreController.store.bind(productStoreController));
router.use("/product", apiWebHook, productRouter);
//
module.exports = router;
//;