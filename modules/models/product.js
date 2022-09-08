const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const timestamps = require("mongoose-timestamp");

const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  // category: { type: Schema.Types.ObjectId, ref: "Category" },
  image: { type: Schema.Types.ObjectId, ref: "Upload" },
  details: { type: Object, default: null },
});

ProductSchema.plugin(timestamps);
//
module.exports = mongoose.model("Product", ProductSchema);
//;