const JWT = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const {
  signupSchema,
  loginSchema,
  OrderSchema,
} = require("../helpers/validation_schema");
const User = require("../models/user.model");
const Product = require("../models/ProductModel");
const Order = require("../models/OrderModel");

const createError = require("http-errors");
const { signAccessToken } = require("../helpers/jwt_helpers");
const { verifyAccessToken } = require("../helpers/jwt_helpers");
const { signRefreshToken } = require("../helpers/jwt_helpers");
const cookieParser = require("cookie-parser");
const { cloudinary } = require("../cloudinary/cloudinary");
router.use(cookieParser());
const asyncHandler = require("express-async-handler");

module.exports = {

  register: async (req, res, next) => {
    try {
      const result = await signupSchema.validateAsync(req.body);
      const doesExist = await User.findOne({ email: result.email });
      if (doesExist) {
        throw createError.Conflict(`${result.email} is already registered`);
      }

      const user = new User(result);
      const savedUser = await user.save();
      console.log({ savedUser });
      const accessToken = await signAccessToken(
        savedUser.id,
        savedUser.name,
        savedUser.propic
      );

      return res.status(200).json({
        userAccessToken: accessToken,
        message: "Logged in successfully 😊 👌",
      });
    } catch (error) {
      console.log(error.message);
      res.json({ error });
      if (error.isJoi === true) error.status = 422;
    }
  },

  login: async (req, res, next) => {
    try {
      const result = await loginSchema.validateAsync(req.body);
      console.log(result);

      const user = await User.findOne({ email: result.email });
      console.log({ user });
      if (!user) throw createError.NotFound("User not found");

      const isMatch = await user.isValidPassword(result.password);

      if (!isMatch)
        throw createError.Unauthorized("User name / password not valid");

      const accessToken = await signAccessToken(
        user.id,
        user.name,
        user.propic
      );
      // const refreshToken = await signRefreshToken(user.id);

      console.log({ accessToken });

      // res.send({ accessToken, refreshToken });
      return res.status(200).json({
        userAccessToken: accessToken,
        message: "Logged in successfully 😊 👌",
      });
    } catch (error) {
      console.log(error);
      if (error.isJoi === true)
        return next(createError.BadRequest("invalid username/password"));
      res.json({ error });
    }
  },

  proPicUpload: async (req, res, next) => {
    try {
      console.log(req.body);
      const userId = req.body.userId;

      console.log({ userId });

      const imgStr = req.body.base64Img;

      const uploadResponse = await cloudinary.uploader.upload(imgStr, {
        upload_preset: "User_propics",

        allowedFormats: ["jpg", "png", "jpeg"],
      });
      console.log(uploadResponse);

      const imgUrl = uploadResponse.url;

      console.log({ imgUrl });

      const updateResp = await User.findByIdAndUpdate(userId, {
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

  searchUsers: asyncHandler(async (req, res, next) => {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
    console.log({ keyword });

    const users = await User.find(keyword);

    res.send(users);
  }),

  getById: asyncHandler(async (req, res, next) => {
    const userId = req.query.userId;

    const user = await User.findById(userId);

    res.status(200).json(user);
  }),

  getCategoryProducts: asyncHandler(async (req, res, next) => {
    const categoryName = req.params.categoryName;

    console.log({ categoryName });

    const products = await Product.find({ category: categoryName });

    console.log(products);
    res.status(200).json(products);
  }),

  getProductById: asyncHandler(async (req, res, next) => {
    try {
      const productId = req.params.productId;

      console.log({ productId });

      const product = await Product.findById(productId);

      console.log(product);
      res.status(200).json(product);
    } catch (error) {
      console.log(error);
    }
  }),

  
  orders: asyncHandler(async (req, res, next) => {
    try {
      const result = await OrderSchema.validateAsync(req.body);

      const order = new Order(result);

      const savedOrder = await order.save();

      console.log(savedOrder);

      res.status(200).json(savedOrder);
    } catch (error) {
      console.log(error);
    }
  }),



  findOrders: asyncHandler(async (req, res, next) => {
    try {
      const orderId = req.params.orderId;

      const order = await Order.findById(orderId);

      console.log(order);

      res.status(200).json(order);

    } catch (error) {

      console.log(error);
    }
  }),


  findAllOrders: asyncHandler(async (req, res, next) => {
    try {
      const userId = req.params.userId;

      const orders = await Order.find({userId:userId});

      console.log(orders);

      res.status(200).json(orders);

    } catch (error) {

      console.log(error);
    }
  }),


  findAllUserProducts: asyncHandler(async (req, res, next) => {
    try {
      const userId = req.params.userId;

      const products = await Order.find({ userId: userId });

      console.log(products);

      res.status(200).json(products);

    } catch (error) {

      console.log(error);
    }
  }),


  locationSort: asyncHandler(async (req, res, next) => {
    try {


      const { userLatitude, userLongitude} = req.body;

      console.log({ userLatitude, userLongitude });
      
        var radius = 15000;
      const sortedProducts = await Product.aggregate([

        {
          $geoNear: {
            near: { type: "Point", coordinates: [+userLongitude,+userLatitude ] },
            distanceField: "dist.calculated",
            maxDistance: radius?+radius:15000,
            includeLocs: "dist.location",
            spherical: true
          }
        }

      ]);
      console.log(sortedProducts);

      res.status(200).json({sortedProducts});

    } catch (error) {

      console.log(error);
    }
  })

};
