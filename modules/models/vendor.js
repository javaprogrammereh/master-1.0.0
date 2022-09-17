const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const timestamps = require("mongoose-timestamp");

const VendorSchema = new Schema({
  name: { type: String, required: true },
  link: { type: String, required: true },
  image: { type: Schema.Types.ObjectId, ref: "Upload" },
});

VendorSchema.plugin(timestamps);
//
module.exports = mongoose.model("Vendor", VendorSchema);
//