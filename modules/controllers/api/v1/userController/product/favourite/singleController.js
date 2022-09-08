const InitializeController = require("./initializeController");
const mongoose = require("mongoose");

module.exports = new (class singleController extends InitializeController {
  async single(req, res) {
    try {
      req.checkParams("id", 110).isMongoId();
      if (this.helper.showValidationErrors(req, res)) return;
      let query = { _id: mongoose.Types.ObjectId(req.params.id) };
      let queryLookUp = {};
      if (req.user.type === "user") queryLookUp = { ...queryLookUp, userId: req.user._id };
      ///
      const aggregateData = [
        { $match: query },
        {
          $lookup: {
            from: "favouriteproducts",
            let: { product_id: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$productId", "$$product_id"] },
                  ...queryLookUp,
                },
              },
            ],
            as: "favouriteproduct",
          },
        },
        { $unwind: "$favouriteproduct" },
        {
          $lookup: {
            from: "uploads",
            let: { file_id: "$image" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$_id", "$$file_id"] },
                },
              },
              { $replaceRoot: { newRoot: "$file" } },
            ],
            as: "image",
          },
        },
        { $unwind: "$image" },
        {
          $addFields: {
            stockAlert: "$favouriteproduct.stockAlert",
            priceAlert: "$favouriteproduct.priceAlert",
            minPrice: "$favouriteproduct.minPrice",
            maxPrice: "$favouriteproduct.maxPrice",
          },
        },
      ];
      const product = (await this.model.Product.aggregate(aggregateData))[0];
      if (!product) return this.helper.response(res, 123);
      product.image = await this.helper.getLinkPublic(product.image);
      const Transform = await this.helper.transform(product, this.helper.itemTransform);
      return this.helper.response(res, 100, null, Transform);
    } catch (err) {
      console.log(err);
      return this.helper.response(res, 125);
    }
  }
})();
//;