const config = require("../../../../../../config");
const controller = require(`${config.path.controllersApi.v1.controller}`);

const Like = require(`${config.path.model}/likeProduct`);
const Product = require(`${config.path.model}/product`);

const { imagesLink } = require(`${config.path.helper.v1}/imagesLink`);
const { index } = require(`${config.path.helper.v1}/indexAggregate`);
const { transform } = require(`${config.path.helper.v1}/transform`);
const itemTransform = ["._id", ".name", ".description", ".details", ".image"];
module.exports = class initializeController extends controller {
  constructor() {
    super();
    this.model = { Like, Product };
    this.helper = { ...this.helper, imagesLink, index, transform, itemTransform };
  }
};
