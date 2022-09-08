const config = require("../../../config");
const express = require("express");
const router = express.Router();
// // middleware
const apiPublic = require("../middleware/public/apipublic");

// //  Controllers
const { public: publicController } = config.path.controllersApi.v1;
// // Controller
//product
const productIndexController = require(`${publicController}/product/indexController`);
const productSingleController = require(`${publicController}/product/singleController`);
///Router
//* product
const productRouter = express.Router();
productRouter.get("/index", productIndexController.index.bind(productIndexController));
productRouter.get("/single/:id", productSingleController.single.bind(productSingleController));
router.use("/product",apiPublic, productRouter);
//
module.exports = router;
//;;