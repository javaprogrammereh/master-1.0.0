const InitializeController = require("./initializeController");
const mongoose = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;
module.exports = new (class singleController extends InitializeController {
  async single(req, res) {
    try {
      req.checkParams("id", "The ID field can not be empty").notEmpty();
      if (this.showValidationErrors(req, res)) return;
      let query = {};
      if (ObjectId.isValid(req.params.id)) {
        query = { ...query, _id: mongoose.Types.ObjectId(req.params.id) };
      } else {
        query = { ...query, alias: req.params.id };
      }
      ///
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
          $lookup: {
            from: "categories",
            localField: "ancestors",
            foreignField: "_id",
            as: "ancestors",
          },
        },
        {
          $project: {
            "ancestors.ancestors": 0,
            "ancestors.parent": 0,
            "ancestors.updatedAt": 0,
            "ancestors.image": 0,
            "ancestors.createdAt": 0,
            "ancestors.active": 0,
            "ancestors.__v": 0,
          },
        },
      ];
      const aggregate = await this.model.Category.aggregate(aggregateData);
      const result = aggregate[0];
      if (!result) return this.abort(res, 404, logcode);
      const link = await this.helper.getLink(result.image);
      if (!link) {
        return this.abort(res, 500, logcode);
      } else result.image = link;
      const Transform = await this.helper.transform(result, this.helper.itemTransform);
      return this.helper.response(res, null, logcode, 200, Transform);
    } catch (err) {
      console.log(err);
      return this.abort(res, 500, logcode);
    }
  }
})();
