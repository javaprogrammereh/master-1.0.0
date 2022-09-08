const InitializeController = require("./initializeController");
const mongoose = require("mongoose");

module.exports = new (class indexController extends InitializeController {
  async index(req, res) {
    try {
      let query = {};
      let sort = {};
      if (req.query.firstParent) {
        req.checkQuery("firstParent", "The information entered is incorrect").isIn(["true"]);
        if (this.showValidationErrors(req, res)) return;
        query = { ...query, parent: null };
      }
      if (req.query.parentId) {
        req.checkQuery("parentId", "The entered ID is incorrect").isMongoId();
        if (this.showValidationErrors(req, res)) return;
        query = { ...query, parent: mongoose.Types.ObjectId(req.query.parentId) };
      }
      ///sort
      if (req.query.sort && req.query.order) {
        req.checkQuery("order", "The information entered for sorting is incorrect").isIn(["ASC", "DESC"]);
        req.checkQuery("sort", "The information entered for sorting is incorrect").isIn(["createdAt"]);
        if (this.showValidationErrors(req, res)) return;
        let sortValue = 1;
        if (req.query.order == "DESC") sortValue = -1;
        sort = { ...sort, createdAt: sortValue };
      } else {
        sort = { ...sort, createdAt: -1 };
      }
      const aggregateData = [
        { $match: query },
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
          $project: {
            ancestors: 0,
          },
        },
        { $sort: sort },
      ];
      const result = await this.helper.index(req, "category", query, aggregateData);
      if (!result) return this.abort(res, 500, logcode);
      if (result.docs.length > 0) {
        for (let index = 0; index < result.docs.length; index++) {
          const element = result.docs[index];
          const link = await this.helper.getLink(element.image);
          if (!link) {
            return this.abort(res, 500, logcode);
          } else element.image = link;
        }
      }
      const Transform = await this.helper.transform(result, this.helper.itemTransform, true);
      return this.helper.response(res, null, logcode, 200, Transform);
    } catch (err) {
      console.log(err);
      return this.abort(res, 500, logcode);
    }
  }
})();
