const { saveFile } = require("./minio");
const uploadModel = require("../../models/upload");
const path = require("path");
const https = require("https");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { unlink } = require("node:fs/promises");

module.exports.saveImageByLink = async (link, type) => {
  return new Promise(async (resolve, rejects) => {
    try {
      let fileType = path.extname(link.split("?")[0]);
      fileType = fileType.slice(fileType.lastIndexOf("."), fileType.length);
      fileType = fileType.replace(/[.]/, "");
      const fileName = `saveImage/${uuidv4()}${fileType}`;
      https.get(link, (res) => {
        const writeStream = fs.createWriteStream(fileName);
        res.pipe(writeStream);
        writeStream.on("finish", async () => {
          const SaveFile = await saveFile(fileName, type, fileType);
          await unlink(fileName);
          const upload = await uploadModel.create({ file: SaveFile, type });
          resolve(upload._id);
        });
      });
    } catch (err) {
      console.log(err);
      rejects(false);
    }
  });
};
//;