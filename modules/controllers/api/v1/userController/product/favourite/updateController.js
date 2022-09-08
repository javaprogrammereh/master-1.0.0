const InitializeController = require("./initializeController");

module.exports = new (class updateController extends InitializeController {
  async update(req, res) {
    try {
      req.checkParams("id", 110).isMongoId();
      if (this.helper.showValidationErrors(req, res)) return;
      const favouriteProduct = await this.model.FavouriteProduct.findOne({
        productId: req.params.id,
        userId: req.user.id,
      }).exec();
      if (!favouriteProduct) return this.helper.response(res, 125);
      let values = {};
      if (req.body.stockAlert) {
        req.checkBody("stockAlert", 3004).isBoolean();
        if (this.helper.showValidationErrors(req, res)) return;
        values = { ...values, stockAlert: req.body.stockAlert };
      }
      if (req.body.priceAlert) {
        req.checkBody("priceAlert", 3005).isBoolean();
        if (this.helper.showValidationErrors(req, res)) return;
        values = { ...values, priceAlert: req.body.priceAlert };
      }
      if (req.body.minPrice) {
        req.checkBody("minPrice", 3007).isNumeric();
        if (this.helper.showValidationErrors(req, res)) return;
        values = { ...values, minPrice: req.body.minPrice };
      }
      if (req.body.maxPrice) {
        req.checkBody("maxPrice", 3009).isNumeric();
        if (this.helper.showValidationErrors(req, res)) return;
        values = { ...values, maxPrice: req.body.maxPrice };
      }
      await this.model.FavouriteProduct.updateOne({ _id: favouriteProduct._id }, values);
      return this.helper.response(res, 102);
    } catch (err) {
      console.log(err);
      return this.helper.response(res, 125);
    }
  }
})();
