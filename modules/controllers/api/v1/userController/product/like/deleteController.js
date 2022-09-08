const InitializeController = require("./initializeController");

module.exports = new (class deleteController extends InitializeController {
  async delete(req, res) {
    try {
      req.checkParams("id", 110).isMongoId();
      if (this.helper.showValidationErrors(req, res)) return;
      const product = await this.model.Product.findOne({ _id: req.params.id }).exec();
      if (!product) return this.helper.response(res, 2052);
      const like = await this.model.Like.findOne({
        productId: req.params.id,
        userId: req.user._id,
      }).exec();
      if (!like) return this.helper.response(res, 2054);
      await this.model.Like.findByIdAndRemove(like._id);
      return this.helper.response(res, 103);
    } catch (err) {
      console.log(err);
      return this.helper.response(res, 125);
    }
  }
})();
