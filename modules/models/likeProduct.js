const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const timestamps = require("mongoose-timestamp");

const LikeProductSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product" },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
});
LikeProductSchema.plugin(timestamps);
module.exports = mongoose.model("LikeProduct", LikeProductSchema);
