const JWT = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const {
  signupSchema,
  loginSchema,
  ProductSchema,
} = require("../helpers/validation_schema");
const Vendor = require("../models/vendor.model");
const Product = require("../models/ProductModel");
const createError = require("http-errors");
const { signVendorAccessToken } = require("../helpers/jwt_helpers");
const { verifyAccessToken } = require("../helpers/jwt_helpers");
const { signRefreshToken } = require("../helpers/jwt_helpers");
const cookieParser = require("cookie-parser");
const { cloudinary } = require("../cloudinary/cloudinary");
const asyncHandler = require("express-async-handler");
const Order = require("../models/OrderModel");

router.use(cookieParser());

module.exports = {
  register: async (req, res, next) => {
    try {
      const Signupdata = req.body;
      console.log({ Signupdata });
      const result = await signupSchema.validateAsync(req.body);

      const doesExist = await Vendor.findOne({ email: result.email });
      if (doesExist) {
        throw createError.Conflict(`${result.email} is already registered`);
      }

      const vendor = new Vendor(result);
      const savedVendor = await vendor.save();
      console.log({ savedVendor });
      const accessToken = await signVendorAccessToken(
        savedVendor.id,
        savedVendor.name,
        savedVendor.propic
      );

      return res.status(200).json({
        vendorAccessToken: accessToken,
        message: "Logged in successfully 😊 👌",
      });
    } catch (error) {
      console.log(error.message);
      res.json({ error });
      if (error.isJoi === true) error.status = 422;
      // next(error);
    }
  },

  login: async (req, res, next) => {
    try {
      const result = await loginSchema.validateAsync(req.body);
      console.log(result);

      const vendor = await Vendor.findOne({ email: result.email });
      console.log({ vendor });
      if (!vendor) throw createError.NotFound("vendor not found");

      const isMatch = await vendor.isValidPassword(result.password);

      if (!isMatch)
        throw createError.Unauthorized("User name / password not valid");

      const vendorAccessToken = await signVendorAccessToken(
        vendor.id,
        vendor.name,
        vendor.propic
      );

      // const refreshToken = await signRefreshToken(user.id);

      console.log({ vendorAccessToken });

      // res.send({ accessToken, refreshToken });
      return res.status(200).json({
        vendorAccessToken: vendorAccessToken,
        message: "Logged in successfully 😊 👌",
      });
    } catch (error) {
      console.log(error);
      res.json({ error });
      if (error.isJoi === true)
        return next(createError.BadRequest("invalid username/password"));

      next(error);
    }
  },

  proPicUpload: async (req, res, next) => {
    try {
      const vendorId = req.body.vendorId;

      console.log({ vendorId });

      const imgStr = req.body.base64Img;

      const uploadResponse = await cloudinary.uploader.upload(imgStr, {
        upload_preset: "Vendor_propics",

        allowedFormats: ["jpg", "png", "jpeg"],
      });
      console.log(uploadResponse);

      const imgUrl = uploadResponse.url;

      console.log({ imgUrl });

      const updateResp = await Vendor.findByIdAndUpdate(vendorId, {
        propic: imgUrl,
      });

      console.log({ updateResp });
      res.json({ msg: "uploaded" });

      // const croppedimg = await cloudinary.url({PublicId},{ width: 400, height: 400,  crop: "limit" })
      // console.log(croppedimg);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  productRegister: asyncHandler(async (req, res, next) => {
    try {
      const {
        address,
        productName,
        productDesc,
        rent,
        category,
        pincode,
        latitude,
        longitude,
        vendorId,
        cityName,
        image1,
        image2,
        image3,

      } = req.body;

      console.log({ productName });
      console.log({ productDesc });
      console.log({ rent });
      console.log({ category });
      console.log({ address });
      console.log({ pincode });
      console.log({ latitude });
      console.log({ longitude });
      console.log({ vendorId });
      console.log({ cityName });


      // const result = await ProductSchema.validateAsync(req.body);

      // console.log(result);


      const uploadResponse = await cloudinary.uploader.upload(image1, {
        upload_preset: "Product_Pics",

        allowedFormats: ["jpg", "png", "jpeg"],
      });


      console.log({ uploadResponse });

      const Product_pic1 = uploadResponse.url;

      const uploadResponse2 = await cloudinary.uploader.upload(image2, {
        upload_preset: "Product_Pics",

        allowedFormats: ["jpg", "png", "jpeg"],
      });

      console.log({ uploadResponse2 });

      const Product_pic2 = uploadResponse2.url;

      const uploadResponse3 = await cloudinary.uploader.upload(image3, {
        upload_preset: "Product_Pics",

        allowedFormats: ["jpg", "png", "jpeg"],
      });

      console.log({ uploadResponse3 });
      const Product_pic3 = uploadResponse3.url;

      const product = {
        address,
        productName,
        productDesc,
        rent,
        category,
        pincode,
        latitude,
        longitude,
        vendorId,
        cityName,
        Product_pic1,
        Product_pic2,
        Product_pic3,
      };

      const NewProduct = new Product(product);

      console.log({ NewProduct });

      const savedProduct = await NewProduct.save();

      console.log({ savedProduct });

      res.status(200).json(NewProduct);

    } catch (error) {
      console.log(error);
    }
  }),




  productUpdate: asyncHandler(async (req, res, next) => {
    try {
      const {
        porductId,
        address,
        productName,
        productDesc,
        rent,
        category,
        pincode,
        latitude,
        longitude,
        vendorId,
        cityName,
        image1,
        image2,
        image3,

      } = req.body;


      console.log({ porductId});
      console.log({ productDesc });
      console.log({ rent });
      console.log({ category });
      console.log({ address });
      console.log({ pincode });
      console.log({ latitude });
      console.log({ longitude });
      console.log({ vendorId });
      console.log({ cityName });


      // const result = await ProductSchema.validateAsync(req.body);

      // console.log(result);


      const uploadResponse = await cloudinary.uploader.upload(image1, {
        upload_preset: "Product_Pics",

        allowedFormats: ["jpg", "png", "jpeg"],
      });


      console.log({ uploadResponse });

      const Product_pic1 = uploadResponse.url;

      const uploadResponse2 = await cloudinary.uploader.upload(image2, {
        upload_preset: "Product_Pics",

        allowedFormats: ["jpg", "png", "jpeg"],
      });

      console.log({ uploadResponse2 });

      const Product_pic2 = uploadResponse2.url;

      const uploadResponse3 = await cloudinary.uploader.upload(image3, {
        upload_preset: "Product_Pics",

        allowedFormats: ["jpg", "png", "jpeg"],
      });

      console.log({ uploadResponse3 });
      const Product_pic3 = uploadResponse3.url;

      const product = {
        address: address,
        productName: productName,
        productDesc: productDesc,
        rent: rent,
        category: category,
        pincode: pincode,
        latitude: latitude,
        longitude: longitude,
        vendorId: vendorId,
        cityName: cityName,
        Product_pic1: Product_pic1,
        Product_pic2: Product_pic2,
        Product_pic3: Product_pic3,
      };



      const updatedProduct = await Product.findOneAndUpdate({_id:porductId}, {
        address: address,
        productName: productName,
        productDesc: productDesc,
        rent: rent,
        category: category,
        pincode: pincode,
        latitude: latitude,
        longitude: longitude,
        vendorId: vendorId,
        cityName: cityName,
        Product_pic1: Product_pic1,
        Product_pic2: Product_pic2,
        Product_pic3: Product_pic3,});

      console.log({ updatedProduct });

      res.status(200).json(updatedProduct);

    } catch (error) {
      console.log(error);
      next(error)
    }
  }),
  
  getById: asyncHandler(async (req, res, next) => {
    const vendorId = req.query.vendorId;

    const vendor = await Vendor.findById(vendorId);

    res.status(200).json(vendor);
  }),



  findAllProducts: asyncHandler(async (req, res, next) => {

    try {

      const vendorId = req.params.vendorId;

      const alllProducts = await Product.find({vendorId:vendorId});

      console.log(alllProducts);

      res.status(200).json(alllProducts);

    } catch (error) {

      console.log(error);
    }

  }),


  findAllVendorOrder: asyncHandler(async (req, res, next) => {

    try {

      const vendorId = req.params.vendorId;

      const allOrders = await Order.find({ "product.vendorId": vendorId });

      console.log(allOrders);

      res.status(200).json(allOrders);

    } catch (error) {

      console.log(error);
    }

  }),



  AcceptOrder: asyncHandler(async (req, res, next) => {

    try {

      const orderId = req.params.orderId;

      const updateResp = await Order.findOneAndUpdate({ _id: orderId }, { Accepted : true ,Pending:false});


      console.log(updateResp.product._id);
      const stockUpdateResp = await Product.findOneAndUpdate({ _id: updateResp.product._id }, { inStock: false });
      // const productId = await Order.findOne({ "product._id": orderId }, );

      console.log({ stockUpdateResp});

      console.log({updateResp});

      res.status(200).json(updateResp);

    } catch (error) {

      console.log(error);
    }

  }),



  RejectOrder: asyncHandler(async (req, res, next) => {

    try {

      const orderId = req.params.orderId;

      const updateResp = await Order.findOneAndUpdate({ _id: orderId }, { Rejected: true, Accepted: false, Returned: false,Pending:false,"product.inStock":false});

      console.log(updateResp);

      res.status(200).json(updateResp);

    } catch (error) {

      console.log(error);
    }

  }),

  ReturnOrder: asyncHandler(async (req, res, next) => {

    try {

      const orderId = req.params.orderId;

      const updateResp = await Order.findOneAndUpdate({ _id: orderId }, { Returned: true, Accepted: false,Pending:false });

      console.log(updateResp);

      const stockUpdateResp = await Product.findOneAndUpdate({ _id: updateResp.product._id }, {inStock:true });

      const DeleteManyUpdateResp = await Order.findByIdAndDelete  ({ _id: orderId });

      console.log(stockUpdateResp );
      console.log({DeleteUpdateResp});

      res.status(200).json(DeleteManyUpdateResp);

    } catch (error) {

      console.log(error);
    }

  }),




  DeleteProduct: asyncHandler(async (req, res, next) => {

    try {

      const productId = req.params.productId;

      const DeleteResp = await Product.findOneAndDelete({ _id:productId});

      console.log(DeleteResp);


      res.status(200).json(DeleteResp);

    } catch (error) {

      res.status(404).json(error);
    }

  })

};
