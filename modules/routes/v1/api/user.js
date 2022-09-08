const config = require("../../../config");
const express = require("express");
const router = express.Router();
// middleware
//  Controllers
const { user: userController } = config.path.controllersApi.v1;
/// Controller
const apiOnlyUser = require("../middleware/user/apiOnlyUser");
const apiUser = require("../middleware/user/apiUser");
// auth
const authGmailLoginController = require(`${userController}/auth/gmailLoginController`);
/// product
//like
const likeDeleteController = require(`${userController}/product/like/deleteController`);
const likeIndexController = require(`${userController}/product/like/indexController`);
const likeIsLikeController = require(`${userController}/product/like/isLikeController`);
const likeStoreController = require(`${userController}/product/like/storeController`);
//favourite
const favouriteDeleteController = require(`${userController}/product/favourite/deleteController`);
const favouriteIndexController = require(`${userController}/product/favourite/indexController`);
const favouriteIsFavouriteController = require(`${userController}/product/favourite/isFavouriteController`);
const favouriteSingleController = require(`${userController}/product/favourite/singleController`);
const favouriteStoreController = require(`${userController}/product/favourite/storeController`);
const favouriteUpdateController = require(`${userController}/product/favourite/updateController`);
///Router
// auth
const authRouter = express.Router();
authRouter.post("/gmailLogin", authGmailLoginController.gmailLogin.bind(authGmailLoginController));
router.use("/auth", authRouter);
///product
// like
const likeRouter = express.Router();
likeRouter.delete("/delete/:id", apiOnlyUser, likeDeleteController.delete.bind(likeDeleteController));
likeRouter.get("/index", apiUser, likeIndexController.index.bind(likeIndexController));
likeRouter.get("/isLike/:id", apiOnlyUser, likeIsLikeController.isLike.bind(likeIsLikeController));
likeRouter.post("/store", apiOnlyUser, likeStoreController.store.bind(likeStoreController));
router.use("/product/like", likeRouter);
// ?favourite
const favouriteRouter = express.Router();
favouriteRouter.delete("/delete/:id", apiOnlyUser, favouriteDeleteController.delete.bind(favouriteDeleteController));
favouriteRouter.get("/index", apiUser, favouriteIndexController.index.bind(favouriteIndexController));
favouriteRouter.get(
  "/isFavourite/:id",
  apiOnlyUser,
  favouriteIsFavouriteController.isFavourite.bind(favouriteIsFavouriteController)
);
favouriteRouter.get("/single/:id", apiUser, favouriteSingleController.single.bind(favouriteSingleController));
favouriteRouter.post("/store", apiOnlyUser, favouriteStoreController.store.bind(favouriteStoreController));
favouriteRouter.patch("/update/:id", apiOnlyUser, favouriteUpdateController.update.bind(favouriteUpdateController));
router.use("/product/favourite", favouriteRouter);
//
module.exports = router;
//;