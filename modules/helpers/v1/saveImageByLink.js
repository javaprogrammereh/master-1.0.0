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
      let uploadIdArray = [];
      if (type == "vendor") {
        let fileType = path.extname(link.split("?")[0]);
        fileType = fileType.slice(fileType.lastIndexOf("."), fileType.length);
        fileType = fileType.replace(/[.]/, "");
        let fileName = `saveImage/${uuidv4()}${fileType}`;
        https.get(link, (res) => {
          const writeStream = fs.createWriteStream(fileName);
          res.pipe(writeStream);
          writeStream.on("finish", async () => {
            let SaveFile = await saveFile(fileName, type, fileType);
            await unlink(fileName);
            const upload = await uploadModel.create({ file: SaveFile, type });
            resolve(upload);
          });
        });
      } else {
        for (var i = 0; i < link.length; i++) {
          let fileType = path.extname(link[i].toString().split("?")[0]);
          fileType = fileType.slice(fileType.lastIndexOf("."), fileType.length);
          fileType = fileType.replace(/[.]/, "");
          let fileName = `saveImage/${uuidv4()}${fileType}`;
          https.get(link[i], (res) => {
            const writeStream = fs.createWriteStream(fileName);
            res.pipe(writeStream);
            writeStream.on("finish", async () => {
              let SaveFile = await saveFile(fileName, type, fileType);
              await unlink(fileName);
              const upload = await uploadModel.create({ file: SaveFile, type });
              uploadIdArray.push(upload._id);
              if (uploadIdArray.length === link.length) {
                resolve(uploadIdArray);
              }
            });
          });
        }
      }
    } catch (err) {
      console.log(err);
      rejects(false);
    }
  });
};
//?
