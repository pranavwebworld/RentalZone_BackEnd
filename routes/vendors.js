const express = require("express");
const router = express.Router();
const { signupSchema, loginSchema } = require("../helpers/validation_schema");
const Vendor = require("../models/vendor.model");
const createError = require("http-errors");
const { signAccessToken } = require("../helpers/jwt_helpers");
const { verifyVendorAccessToken } = require("../helpers/jwt_helpers");
const { signRefreshToken } = require("../helpers/jwt_helpers");
const cookieParser = require("cookie-parser");
router.use(cookieParser());
const vendorController = require('../controller/vendorController')





// @post vendor register
// @body vendor details
// @return JWT 


router.post("/register", vendorController.register);


// @post vendorregister
// @body vendorr details
// @return JWT 

router.post("/login", vendorController.login);


// @get user authorization
// @cookies JWT 
// @return boolean True or false 


router.get("/isVLoggedIn", verifyVendorAccessToken, async (req, res, next) => {

    var payload = req.payload
    console.log(req.payload);
    res.json({ payload })


});


// @post vendor propic
// @return boolean True or false 

router.post("/proPicUpload", vendorController.proPicUpload)


// @get params userId
// @return matched users

router.get("/getbyId", vendorController.getById);



//@put update product
//@body product details
// @return upload response
router.put("/productEdit", vendorController.productUpdate)


//@post Product Details 
//@body vendoId
// @return upload response
router.post("/productRegister", vendorController.productRegister)



// @post Product picture 
//@body vendoId
// @return upload response
router.post("/productPicUpload", vendorController.proPicUpload)



//@get Product Details 
//@params vendorId Details
//@return register  response
router.get("/getAllVendorProducts/:vendorId", vendorController.findAllProducts)



//@get All vendor Orders 
//@params Product Details
//@return register  response
router.get("/getAllVendorOrders/:vendorId", vendorController.findAllVendorOrder)




//@patch order Accepted
//@params  order status and orderId
//@return register  response
router.patch("/Orderstatus/Accepted/:orderId", vendorController.AcceptOrder)



//@patch order Rejected
//@params  order status and orderId
//@return register  response
router.patch("/Orderstatus/Rejected/:orderId", vendorController.RejectOrder)


//@patch order Returned
//@params  order status and orderId
//@return register  response
router.patch("/Orderstatus/Returned/:orderId", vendorController.ReturnOrder)


//@delete 
//@params  productId
//@return delte  response
router.delete("/deleteProduct/:productId", vendorController.DeleteProduct)



module.exports = router;
