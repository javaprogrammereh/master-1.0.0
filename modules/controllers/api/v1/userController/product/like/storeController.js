const InitializeController = require("./initializeController");

module.exports = new (class storeController extends InitializeController {
  async store(req, res) {
    try {
      req.checkBody("productId", 2050).notEmpty();
      req.checkBody("productId", 2051).isMongoId();
      if (this.helper.showValidationErrors(req, res)) return;
      const product = await this.model.Product.findOne({ _id: req.body.productId }).exec();
      if (!product) return this.helper.response(res, 2052);
      const like = await this.model.Like.findOne({
        productId: req.body.productId,
        userId: req.user._id,
      }).exec();
      if (like) return this.helper.response(res, 2053);
      await this.model.Like.create({
        productId: req.body.productId,
        userId: req.user._id,
      });
      return this.helper.response(res, 101);
    } catch (err) {
      console.log(err);
      return this.helper.response(res, 125);
    }
  }
})();
