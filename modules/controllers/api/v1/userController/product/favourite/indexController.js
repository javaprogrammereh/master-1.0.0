const InitializeController = require("./initializeController");
const mongoose = require("mongoose");

module.exports = new (class indexController extends InitializeController {
  async index(req, res) {
    try {
      let query = {};
      let sort = {};
      let queryLookUp = {};
      if (req.user.type === "user") queryLookUp = { ...queryLookUp, userId: req.user._id };
      else {
        if (req.query.userId) {
          req.checkQuery("userId", 3011).isMongoId();
          if (this.helper.showValidationErrors(req, res)) return;
          queryLookUp = { ...queryLookUp, userId: mongoose.Types.ObjectId(req.query.userId) };
        }
      }
      if (req.query.sort && req.query.order) {
        //sort
        req.checkQuery("order", 133).isIn(["ASC", "DESC"]);
        req.checkQuery("sort", 133).isIn(["createdAt"]);
        if (this.helper.showValidationErrors(req, res)) return;
        let sortValue = 1;
        if (req.query.order == "DESC") sortValue = -1;
        sort = { ...sort, createdAt: sortValue };
      } else {
        sort = { ...sort, createdAt: -1 };
      }
      ///
      const queryData = [
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
      ];
      const aggregateData = [
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
      const result = await this.helper.index(req, "product", queryData, aggregateData, sort);
      if (!result) return this.helper.response(res, 125);
      result.docs = await this.helper.imagesLink(result.docs);
      const Transform = await this.helper.transform(result, this.helper.itemTransform, true);
      return this.helper.response(res, 100, null, Transform);
    } catch (err) {
      console.log(err);
      return this.helper.response(res, 125);
    }
  }
})();
