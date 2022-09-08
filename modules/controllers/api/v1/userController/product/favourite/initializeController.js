const config = require("../../../../../../config");
const controller = require(`${config.path.controllersApi.v1.controller}`);

const FavouriteProduct = require(`${config.path.model}/favouriteProduct`);
const Product = require(`${config.path.model}/product`);
//
const { imagesLink } = require(`${config.path.helper.v1}/imagesLink`);
const { getLinkPublic } = require(`${config.path.helper.v1}/minio`);
const { index } = require(`${config.path.helper.v1}/indexAggregate`);
const { transform } = require(`${config.path.helper.v1}/transform`);
const itemTransform = [
  "._id",
  ".name",
  ".description",
  ".details",
  ".image",
  ".stockAlert",
  ".priceAlert",
  ".minPrice",
  ".maxPrice",
];
module.exports = class initializeController extends controller {
  constructor() {
    super();
    this.model = { FavouriteProduct, Product };
    this.helper = { ...this.helper, imagesLink, getLinkPublic, index, transform, itemTransform };
  }
};
//;