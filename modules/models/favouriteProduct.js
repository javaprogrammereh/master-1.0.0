const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const timestamps = require("mongoose-timestamp");

const FavouriteProductSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product" },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  stockAlert: { type: Boolean, default: false },
  priceAlert: { type: Boolean, default: false },
  minPrice: { type: String, default: null },
  maxPrice: { type: String, default: null },
  sendTimePrice: { type: Date, default: new Date() },
  sendTimeStock: { type: Date, default: new Date() },
});

FavouriteProductSchema.plugin(timestamps);

module.exports = mongoose.model("FavouriteProduct", FavouriteProductSchema);
//;