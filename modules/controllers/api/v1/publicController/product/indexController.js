const InitializeController = require("./initializeController");
const mongoose = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports = new (class indexController extends InitializeController {
  async index(req, res) {
    try {
      let query = {};
      let sort = {};
      let aggregateData = [];
      let queryfavourite = [];
      //sort
      if (req.query.sort && req.query.order) {
        req.checkQuery("order", 133).isIn(["ASC", "DESC"]);
        req.checkQuery("sort", 133).isIn(["createdAt", "popular"]);
        if (this.helper.showValidationErrors(req, res)) return;
        let sortValue = 1;
        if (req.query.order == "DESC") sortValue = -1;
        if (req.query.sort == "popular") sort = { ...sort, likeCount: sortValue };
        if (req.query.sort == "createdAt") sort = { ...sort, createdAt: sortValue };
      } else {
        sort = { ...sort, createdAt: -1 };
      }
      if (req.user && req.user.type === "user") {
        queryfavourite = [
          {
            $lookup: {
              from: "favouriteproducts",
              let: { product_id: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ["$productId", "$$product_id"] },
                    userId: mongoose.Types.ObjectId(req.user._id),
                  },
                },
              ],
              as: "favouriteproduct",
            },
          },
          {
            $addFields: {
              itsfavorit: {
                //*
                $cond: [{ $eq: ["$favouriteproduct._id", []] }, false, true],
                // $cond : [{$eq : ["$favouriteproduct" , []]},false, true]
                //*
              },
            },
          },
        ];
      } else {
        //else favouriteproduct= null
      }
      const queryData = [
        { $match: query },
        {
          $lookup: {
            from: "likeproducts",
            let: { product_id: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$productId", "$$product_id"] },
                },
              },
            ],
            as: "like",
          },
        },
        {
          $addFields: {
            likeCount: { $size: "$like" },
          },
        },
      ];
       aggregateData = [
        {
          $lookup: {
            from: "productitems",
            let: { product_id: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$productId", "$$product_id"] },
                },
              },
              { $sort: { isStock: -1, price: 1, createdAt: -1 } },
            ],
            as: "productitems",
          },
        },
        {
          $addFields: {
            price: { $arrayElemAt: ["$productitems.price", 0] },
            isStock: { $arrayElemAt: ["$productitems.isStock", 0] },
            vendor: { $arrayElemAt: ["$productitems.vendorId", 0] },
          },
        },
        {
          $lookup: {
            from: "vendors",
            let: { vendor_id: "$vendor" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$_id", "$$vendor_id"] },
                },
              },
              {
                $lookup: {
                  from: "uploads",
                  let: { file_id: "$image" },//*
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
            ],
            as: "lastVendor",
          },
        },
        { $unwind: "$lastVendor" },
        {
          //*
          $lookup: {
            from: "uploads",
            let: { file_id: "$imageGallery" }, //*
            pipeline: [
              {
                $match: {
                  $expr: {
                    $in: ["$_id", "$$file_id"],
                  },
                },
              },
              { $replaceRoot: { newRoot: "$file" } },
            ],
            as: "image",
          },
        },
        {
          $addFields: {
            image: { $first: "$image" } ,
          },
        },
        // {
        //   $lookup: {
        //     from: "uploads",
        //     let: { file_id: "$image" },
        //     pipeline: [
        //       {
        //         $match: {
        //           $expr: { $eq: ["$_id", "$$file_id"] },
        //         },
        //       },
        //       { $replaceRoot: { newRoot: "$file" } },
        //     ],
        //     as: "image",
        //   },
        // },
        // { $unwind: "$image" },
        ...queryfavourite,
        {
          $project: {
            name: 1,
            description: 1,
            details: 1,
            file:1,
            path:1,
            bucketname:1,
            image:1,
            // imageGallery: 1, //*
            price: 1,
            isStock: 1,
            likeCount: 1,
            lastVendor: {
              _id: 1,
              name: 1,
              link: 1,
              image: 1,
            },
            itsfavorit: 1,
          },
        },
      ];
      let result = await this.helper.index(req, "product", queryData, aggregateData, sort);
      console.log("index result docs: ",result.docs);
      result.docs = await this.helper.imagesLink(result.docs);
      console.log("index result after  imagesLink: ",result);
      const Transform = await this.helper.transform(result, this.helper.itemTransform, true);
      return this.helper.response(res, 100, null, Transform);
    } catch (err) {
      console.log(err);
      return this.helper.response(res, 125);
    }
  }
})();
