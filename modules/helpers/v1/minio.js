const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const Minio = require("minio");
const { rejects } = require("assert");
const minioEndPoint = process.env.MINIO_ENDPOINT;
const minioPort = process.env.MINIO_PORT;
const minioAccessKey = process.env.MINIO_ACCESSKEY;
const minioSecretKey = process.env.MINIO_SECRETKEY;
const bucketnameProduct = process.env.MINIO_BUCKETNAME_PRODUCT;
const bucketnameVendor = process.env.MINIO_BUCKETNAME_VENDOR;
const minioLink = process.env.MINIO_LINK;

const minioClient = new Minio.Client({
  endPoint: minioEndPoint,
  port: Number(minioPort),
  useSSL:false,
  accessKey: minioAccessKey,
  secretKey: minioSecretKey,
});
module.exports.saveFile = async (file, type, fileType = null) => {
  try {
    let bucketname = null;
    if (type == "product") bucketname = bucketnameProduct;
    if (type == "vendor") bucketname = bucketnameVendor;
    const fileName = uuidv4();
    const metaData = {
      "Content-Type": "application/octet-stream",
    };
    let path = null;
    if (fileType == null) path = fileName;
    else path = `${fileName}.${fileType}`;
    let data = file;
    if (type == "vendor" || type == "product") data = fs.readFileSync(file, { "Content-Type": `image/${fileType}` });
    const result = await minioClient.putObject(bucketname, path, data, metaData);
    if (result.err) {
      console.log(err);
      return false;
    }
    return { bucketname, path };
  } catch (err) {
    console.log(err);
    return false;
  }
};
module.exports.getFile = async (object) => {
  return new Promise(async (resolve, rejects) => {
    try {
      let chunks = [];
      const objectStream = await minioClient.getObject(object.bucketname, object.path);
      objectStream.on("data", function (chunk) {
        chunks.push(chunk);
      });
      objectStream.on("end", function () {
        resolve(Buffer.concat(chunks));
      });
    } catch (err) {
      console.log(err);
      rejects(false);
    }
  });
};
module.exports.removeFile = async (object) => {
  try {
    await minioClient.removeObject(object.bucketname, object.path);
    return true;
  } catch (err) {
    console.log(object, err);
    return false;
  }
};
module.exports.getLinkPublic = async (object) => {
  try {
    return `${minioLink}/${object.bucketname}/${object.path}`;
  } catch (err) {
    return false;
  }
};
//