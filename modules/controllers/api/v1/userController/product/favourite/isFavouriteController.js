const InitializeController = require("./initializeController");

module.exports = new (class isFavouriteController extends InitializeController {
  async isFavourite(req, res) {
    try {
      req.checkParams("id", 110).isMongoId();
      if (this.helper.showValidationErrors(req, res)) return;
      const product = await this.model.Product.findOne({ _id: req.params.id }).exec();
      if (!product) return this.helper.response(res, 3002);
      const favouriteProduct = await this.model.FavouriteProduct.findOne({
        productId: req.params.id,
        userId: req.user._id,
      }).exec();
      if (favouriteProduct) return this.helper.response(res, 100, null, { action: true });
      return this.helper.response(res, 100, null, { action: false });
    } catch (err) {
      console.log(err);
      return this.helper.response(res, 125);
    }
  }
})();
