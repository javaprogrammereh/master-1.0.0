const InitializeController = require("./initializeController");
const isObject = (obj) => {
  return Object.prototype.toString.call(obj) === "[object Object]";
};
module.exports = new (class storeController extends InitializeController {
  async store(req, res) {
    try {
      req.checkBody("productName", 1000).notEmpty();
      req.checkBody("productImages", 1001).notEmpty();
      req.checkBody("productDescription", 1002).notEmpty();
      req.checkBody("productLink", 1003).notEmpty();
      req.checkBody("productIsStock", 1004).notEmpty();
      req.checkBody("productIsStock", 1005).isBoolean();
      req.checkBody("vendorName", 1006).notEmpty();
      req.checkBody("vendorImage", 1007).notEmpty();
      req.checkBody("vendorLink", 1008).notEmpty();
      if (this.helper.showValidationErrors(req, res)) return;
      let productItemValues = {
        link: req.body.productLink,
        isStock: req.body.productIsStock,
      };
      let productValue = {};
      let productId = null;
      let vendorId = null;
      let recordedAt = null;
      if (req.body.details) {
        let details = null;
        try {
          details = JSON.parse(req.body.details);
          if (!isObject(details)) return this.helper.response(res, 1012, "details");
          productValue = { ...productValue, details };
        } catch (err) {
          return this.helper.response(res, 1012, "details");
        }
      }
      //value ProductItem
      if (req.body.recordedAt) {
        req.checkBody("recordedAt", 1009).isISO8601().toDate();
        if (this.helper.showValidationErrors(req, res)) return;
        recordedAt = new Date(req.body.recordedAt);
      } else recordedAt = new Date();
      productItemValues = { ...productItemValues, recordedAt };
      if (req.body.productIsStock == "true") {
        req.checkBody("productPrice", 1010).notEmpty();
        if (this.helper.showValidationErrors(req, res)) return;
        productItemValues = { ...productItemValues, price: req.body.productPrice };
      }
      //end ProductItem
    
      //?1.Product create
      const checkProduct = await this.model.Product.findOne({ name: req.body.productName }).exec();
      if (checkProduct) productId = checkProduct._id;
      else {
        //*
        let productImages =[];
        let imagesGallery=[];
        for (var images in req.body.productImages) {
            productImages.push(req.body.productImages[images]) ;
        }
       //*
       imagesGallery =await this.helper.saveImageByLink( productImages,"product");
        const newProduct = await this.model.Product.create({
          ...productValue,
          name: req.body.productName,
          description: req.body.productDescription,
          imageGallery: imagesGallery,
        });
        productId = newProduct._id;
      }
      // end Product
 
      //2.Vendor create
      const checkVendor = await this.model.Vendor.findOne({ name: req.body.vendorName }).exec();
      if (checkVendor) vendorId = checkVendor._id;
      else {
        const vendorImage = await this.helper.saveImageByLink(req.body.vendorImage, "vendor");
        const newVendor = await this.model.Vendor.create({
          name: req.body.vendorName,
          link: req.body.vendorLink,
          image: vendorImage,
        });
        vendorId = newVendor._id;
      }
      //Vendor
      
      //3.ProductItems  create
      await this.model.ProductItems.create({ ...productItemValues, vendorId, productId });
      // end ProductItems
      return this.helper.response(res, 101);
    } catch (err) {
      console.log(err);
      return this.helper.response(res, 125);
    }
  }
})();
//;