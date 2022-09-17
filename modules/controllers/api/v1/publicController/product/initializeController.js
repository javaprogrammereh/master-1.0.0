const config = require("../../../../../config");
const controller = require(`${config.path.controllersApi.v1.controller}`);

const Product = require(`${config.path.model}/product`);
const FavouriteProduct = require(`${config.path.model}/favouriteProduct`);
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
  ".imageGallery",
  ".price",
  ".image",
  ".isStock",
  ".lastVendor",
  ".likeCount",
  ".vendors",
  ".stockAlert",
  ".priceAlert",
  ".minPrice",
  ".maxPrice",
  ".favouriteproduct",
  ".itsfavorit",
  ".file",
  ".bucketname",
  ".path"
];
//
module.exports = class initializeController extends controller {
  constructor() {
    super();
    (this.model = { FavouriteProduct,Product }),
      (this.helper = { ...this.helper, getLinkPublic, imagesLink, index, transform, itemTransform });
  }
};
