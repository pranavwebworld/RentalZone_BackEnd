const express = require("express");
const router = express.Router();
const { signupSchema, loginSchema } = require("../helpers/validation_schema");
const User = require("../models/user.model");
const createError = require("http-errors");
const { signAccessToken } = require("../helpers/jwt_helpers");
const { verifyAccessToken } = require("../helpers/jwt_helpers");
const { signRefreshToken } = require("../helpers/jwt_helpers");
const cookieParser = require("cookie-parser");
router.use(cookieParser());
const userController = require('../controller/userController')



// @post user register
// @body user details
// @return JWT 


router.post("/register",userController.register );

// @post user register
// @body user details
// @return JWT 

router.post("/login",userController.login);


// @get user authorization
// @cookies JWT 
// @return boolean True or false 


router.get("/isLoggedIn", verifyAccessToken, async (req, res, next) => {
  
  var payload = req.payload
  console.log(req.payload);
  res.json({ payload })
 
});


// @post user propic
// @return boolean True or false 
router.post("/proPicUpload", userController.proPicUpload)



// @get send search query
// @return matched users
router.get("/searchUsers", userController.searchUsers);



// @get params userId
// @return matched users
router.get("/getbyId", userController.getById);



// @get params category name
// @return matched category products
router.get("/getCatproduct/:categoryName", userController.getCategoryProducts);



// @get params productID
// @return product Details
router.get("/getProductById/:productId", userController.getProductById);



//@post order registration
//@body order details
//@return  save response
router.post("/order", userController.orders);



//@get 
//@params orerId
//@return  order Details
router.get("/getOrderbyId/:orderId", userController.findOrders);



//@get 
//@params orerId
//@return  order Details
router.post("/sortByLocation", userController.locationSort);


//@get 
//@params UserId
//@return  allorders of user
router.get("/getAllOrders/:userId", userController.findAllOrders);



//@get 
//@params UserId
//@return  allorders of user

router.get("/getUserProducts/:userId", userController.findAllUserProducts);




module.exports = router;  