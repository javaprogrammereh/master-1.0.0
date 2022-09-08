const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const timestamps = require("mongoose-timestamp");

const VerifySchema = new Schema({
  mobile: { type: String, required: true },
  userType: { type: String, required: true },
  code: { type: String, required: true },
  mode: { type: Object, required: true },
  isUse: { type: Boolean, default: false },
});
VerifySchema.plugin(timestamps);
module.exports = mongoose.model("Verify", VerifySchema);
