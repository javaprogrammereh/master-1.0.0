const config = require("../../../../../config");
const controller = require(`${config.path.controller}/controller`);

const Category = require(`${config.path.model}/category`);

const { response } = require(`${config.path.helper}/response`);
const { index } = require(`${config.path.helper}/indexAggregate`);
const { getLink } = require(`${config.path.helper}/minio`);
const { transform } = require(`${config.path.helper}/transform`);
const itemTransform = [
  "._id",
  ".alias",
  ".title",
  ".description",
  ".keywords",
  ".canonicalUrl",
  ".sitemapPriority",
  ".sitemapFrequency",
  ".image",
  ".ancestors",
];
module.exports = class initializeController extends controller {
  constructor() {
    super();
    (this.model = { Category }), (this.helper = { index, response, transform, getLink, itemTransform });
  }
};
