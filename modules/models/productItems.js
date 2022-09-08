const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const timestamps = require("mongoose-timestamp");

const ProductItemsSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product" },
  vendorId: { type: Schema.Types.ObjectId, ref: "Vendor" },
  price: { type: String, default: null },
  link: { type: String },
  isStock: { type: Boolean },
  recordedAt: { type: Date },
});

ProductItemsSchema.plugin(timestamps);
//
module.exports = mongoose.model("ProductItems", ProductItemsSchema);
//;