const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const timestamps = require("mongoose-timestamp");

const UploadSchema = new Schema({
  file: {
    bucketname: { type: String },
    path: { type: String },
  },
  type: { type: String },
});
//
UploadSchema.plugin(timestamps);

//
module.exports = mongoose.model("Upload", UploadSchema);
