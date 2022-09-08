const InitializeController = require("./initializeController");
const mongoose = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;
module.exports = new (class singleController extends InitializeController {
  async single(req, res) {
    try {
      let aggregateData=[];
      let queryfavourite =[];
      req.checkParams("id", 110).isMongoId();
      if (this.helper.showValidationErrors(req, res)) return "";
      let query = { _id: mongoose.Types.ObjectId(req.params.id) };
    if (req.user&&req.user.type === "user") {
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
        // { $unwind: "$favouriteproduct" },
        {
          $addFields: {
            itsfavorit: { 
              //*
              $cond : [{$eq : ["$favouriteproduct._id" , []]},false, true]
              // $cond : [{$eq : ["$favouriteproduct" , []]},false, true]
              //*
            }
              
              // $cond : [{$eq : [{ $ifNull: ["$favouriteproduct", null]} , null]}, 0, 1]
              // $ifNull: [ "$favouriteproduct", null ] },
              // $cond: {
                // if: {  $eq:[{ $ifNull: [ "$favouriteproduct._id", null ] },null] } ,
                //  if: { $eq: ["$favouriteproduct",null]}, 
                // if: { 
                  // $ifNull: ["$favouriteproduct._id", false || true]
                  // $ifNull: [ "$favouriteproduct._id", false]
                // },
                // then: false, 
                // else: true            
            // },
          
            // itsfavorit: { 
              // $eq: ["$favouriteproduct",null]}, 
              // $cond: {
                // if: {  $eq:[{ $ifNull: [ "$favouriteproduct._id", null ] },null] } ,
                //  if: { $eq: ["$favouriteproduct",null]}, 
                // if: { $ifNull: [ "$favouriteproduct._id", null]},
                // then: false, 
                // else: true               
              // }
          //  } 
           
            // itsfavorit: { $ifNull: [ "$favouriteproduct", false ] }
            // itsfavorit:{ $arrayElemAt: ["$favouriteproduct", null] },
            //
            //return favouriteproduct array 
            //if (favouriteproduct.i[0]) >> itsfavorit=true
            //else >>  itsfavorit=false
          },
      }];
    }else{
      //else favouriteproduct= null
    }
       aggregateData = [
        { $match: query },
        ...queryfavourite,
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
            from: "productitems",
            let: { product_id: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$productId", "$$product_id"] },
                },
              },
              {
                $group: {
                  _id: "$vendorId",
                },
              },
              {
                $lookup: {
                  from: "vendors",
                  let: { vendor_id: "$_id" },
                  pipeline: [
                    {
                      $match: {
                        $expr: { $eq: ["$_id", "$$vendor_id"] },
                      },
                    },
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
                  ],
                  as: "vendor",
                },
              },
              { $unwind: "$vendor" },
              {
                $lookup: {
                  from: "productitems",
                  let: { vendor_id: "$_id" },
                  pipeline: [
                    {
                      $match: {
                        $expr: { $eq: ["$vendorId", "$$vendor_id"] },
                        productId: mongoose.Types.ObjectId(req.params.id),
                      },
                    },
                    { $sort: { isStock: -1, price: 1, createdAt: -1 } },
                  ],
                  as: "statistics",
                },
              },
              {
                $addFields: {
                  link: { $arrayElemAt: ["$statistics.link", 0] },
                },
              },
            ],
            as: "vendors",
          },
        },
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
        {
          $addFields: {
            lastStatistics: { $arrayElemAt: ["$vendors.statistics", 0] },
          },
        },
        {
          $addFields: {
            isStock: { $arrayElemAt: ["$lastStatistics.isStock", 0] },
            price: { $arrayElemAt: ["$lastStatistics.price", 0] },
          },
        },
        {
          $project: {
            name: 1,
            description: 1,
            image: 1,
            details: 1,
            isStock: 1,
            price: 1,
            likeCount: 1,
            // favouriteproduct:{
              itsfavorit: 1,
          // }
            vendors: {
              vendor: {
                _id: 1,
                name: 1,
                link: 1,
                image: 1,
              },
              link: 1,
              statistics: {
                price: 1,
                isStock: 1,
                recordedAt: 1,
                createdAt: 1,
              },
            },
          },
        },
      ];
      const product = (await this.model.Product.aggregate(aggregateData))[0];
      if (!product) return this.helper.response(res, 123);
      product.image = await this.helper.getLinkPublic(product.image);
      product.vendors = await this.helper.imagesLink(product.vendors);
      const Transform = await this.helper.transform(product, this.helper.itemTransform);
      return this.helper.response(res, 100, null, Transform);
    } catch (err) {
      console.log(err);
      return this.helper.response(res, 125);
    }
  }
})();
//;;