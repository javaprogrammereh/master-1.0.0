const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const timestamps = require("mongoose-timestamp");

const TokenSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  token: { type: String },
  liveTime: { type: Date },
  deviceName: { type: String },
  lastIp: { type: String },
});
TokenSchema.plugin(timestamps);
module.exports = mongoose.model("Token", TokenSchema);
