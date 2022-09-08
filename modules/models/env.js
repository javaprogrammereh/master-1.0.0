const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const timestamps = require("mongoose-timestamp");

const EnvSchema = new Schema({
  type: { type: String, required: true, unique: true },
  object: { type: Object, required: true },
});
//
EnvSchema.plugin(timestamps);
//
module.exports = mongoose.model("Env", EnvSchema);
