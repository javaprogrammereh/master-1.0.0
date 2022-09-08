const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const timestamps = require("mongoose-timestamp");
//
const CategorySchema = new Schema({
  title: { type: String, required: true },
  ancestors: [{ type: Schema.Types.ObjectId, default: null, ref: "Category" }],
  parent: { type: Schema.Types.ObjectId, default: null, ref: "Category" },
});
//
CategorySchema.plugin(timestamps);
//
module.exports = mongoose.model("Category", CategorySchema);
