const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const timestamps = require("mongoose-timestamp");
const crypto = require("crypto");
const envModel = require("./env");

const UserSchema = new Schema({
  firstName: { type: String, default: null },
  lastName: { type: String, default: null },
  email: { type: String },
  password: { type: String },
  googleId: { type: String },
  type: { type: String, required: true },
});
//
UserSchema.plugin(timestamps);
// UserSchema.pre("save", async function (next) {
//   if (this.type === "superAdmin") {
//     const env = await envModel.findOne({ type: "hashPassword" });
//     if (!env) throw new Error("can`t find hashPassword in env model");
//     const cipher = crypto.createCipheriv(
//       env.object.algorithm,
//       Buffer.from(env.object.securitykey, "base64"),
//       Buffer.from(env.object.initVector, "base64")
//     );
//     let encryptedData = cipher.update(this.password, "utf-8", "hex");
//     encryptedData += cipher.final("hex");
//     this.password = encryptedData;
//   }
//   next();
// });
//
module.exports = mongoose.model("User", UserSchema);
