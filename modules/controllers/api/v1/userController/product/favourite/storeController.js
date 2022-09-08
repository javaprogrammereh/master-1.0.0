const InitializeController = require("./initializeController");

module.exports = new (class storeController extends InitializeController {
  async store(req, res) {
    try {
      req.checkBody("productId", 3000).notEmpty();
      req.checkBody("productId", 3001).isMongoId();
      if (this.helper.showValidationErrors(req, res)) return;
      const product = await this.model.Product.findOne({
        _id: req.body.productId,
      }).exec();
      if (!product) return this.helper.response(res, 3002);
      const favouriteProduct = await this.model.FavouriteProduct.findOne({
        productId: req.body.productId,
        userId: req.user._id,
      }).exec();
      if (favouriteProduct) return this.helper.response(res, 3003);
      let values = {
        productId: req.body.productId,
        userId: req.user._id,
      };
      if (req.body.stockAlert) {
        req.checkBody("stockAlert", 3004).isBoolean();
        if (this.helper.showValidationErrors(req, res)) return;
        values = { ...values, stockAlert: req.body.stockAlert };
      }
      if (req.body.priceAlert) {
        req.checkBody("priceAlert", 3005).isBoolean();
        req.checkBody("minPrice", 3006).notEmpty();
        req.checkBody("minPrice", 3007).isNumeric();
        req.checkBody("maxPrice", 3008).notEmpty();
        req.checkBody("maxPrice", 3009).isNumeric();
        if (this.helper.showValidationErrors(req, res)) return;
        values = {
          ...values,
          priceAlert: req.body.priceAlert,
          minPrice: req.body.minPrice,
          maxPrice: req.body.maxPrice,
        };
      }
      await this.model.FavouriteProduct.create(values);
      return this.helper.response(res, 101);
    } catch (err) {
      console.log(err);
      return this.helper.response(res, 125);
    }
  }
})();
//;;
