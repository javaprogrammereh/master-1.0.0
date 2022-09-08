const config = require("../../../../../config");
const controller = require(`${config.path.controllersApi.v1.controller}`);

const Product = require(`${config.path.model}/product`);
const ProductItems = require(`${config.path.model}/productItems`);
const Vendor = require(`${config.path.model}/vendor`);

const { saveImageByLink } = require(`${config.path.helper.v1}/saveImageByLink`);

module.exports = class initializeController extends controller {
  constructor() {
    super();
    this.model = { Product, ProductItems, Vendor };
    this.helper = { ...this.helper, saveImageByLink };
  }
};
