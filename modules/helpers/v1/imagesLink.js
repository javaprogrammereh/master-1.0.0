const { getLinkPublic } = require("./minio");

module.exports.imagesLink = async (items) => {
  try {
    // Object.values(items)
    for (const item of items) {
      if (item.imageGallery) {
        // for (var i = 0; i < item.imageGallery.length; i++) {
          item.imageGallery = await getLinkPublic(item.imageGallery);
          // }
      }
      if (item.image) {
          item.image = await getLinkPublic(item.image);
      }
      if (item.vendor) {
        if (item.vendor.image)
          item.vendor.image = await getLinkPublic(item.vendor.image);
      }
      if (item.lastVendor) {
        if (item.lastVendor.image)
          item.lastVendor.image = await getLinkPublic(item.lastVendor.image);
      }
    }
    return items;
  } catch (err) {
    console.log(err);
    return false;
  }
};
//
