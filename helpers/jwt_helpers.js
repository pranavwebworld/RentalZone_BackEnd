const JWT = require("jsonwebtoken");
const createErrors = require("http-errors");
const { options } = require("../app");


module.exports = {

  signVendorAccessToken: (vendorId,vendor,pic) => {

    return new Promise((resolve, reject) => {
      const payload = {
        name :vendor,
        pic:pic
      };
      const secret = process.env.ACCESS_TOKEN_SECRET;
      const options = {
        expiresIn: "1y",
        issuer: "RentalZone.com",
        audience: vendorId,
      };

      JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
          console.log(err.message);
          reject(createErrors.InternalServerError());
        }
        resolve(token);
      });
    });
  },

  signAccessToken: (userId, user, pic) => {

    return new Promise((resolve, reject) => {
      const payload = {
        name: user,
        pic: pic
      };
      const secret = process.env.ACCESS_TOKEN_SECRET;
      const options = {
        expiresIn: "1y",
        issuer: "RentalZone.com",
        audience: userId,
      };

      JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
          console.log(err.message);
          reject(createErrors.InternalServerError());
        }
        resolve(token);
      });
    });
  },


   verifyAccessToken: (req, res, next) => {

    const token =req.cookies.userAccessToken

      console.log({token});
      // if (!req.cookies.userAccessToken) return next(createErrors.Unauthorized());

    // const authHeader = req.headers["authorization"];
    // const bearerToken = authHeader.split(" ");
    // console.log(bearerToken);
    // const token = bearerToken[1];

    JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
      if (err) {

        // const message =
        //   err.name === "JasonWebTokenError" ? "Unauthorized" : err.message;

        // return next(createErrors.Unauthorized(message));

        console.log(err);
        return res.json({})
      }
      console.log("verify acees token");
      console.log(payload);
      req.payload = payload;
    
      next();
    });
  },


  verifyVendorAccessToken: (req, res, next) => {

    const vendorToken = req.cookies.vendorAccessToken

    console.log({ vendorToken });
    // if (!req.cookies.userAccessToken) return next(createErrors.Unauthorized());

    // const authHeader = req.headers["authorization"];
    // const bearerToken = authHeader.split(" ");
    // console.log(bearerToken);
    // const token = bearerToken[1];

    JWT.verify(vendorToken, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
      if (err) {


        // const message =
        //   err.name === "JasonWebTokenError" ? "Unauthorized" : err.message;

        // return next(createErrors.Unauthorized(message));

        return res.json({payload:undefined})
      }

      console.log("Vendor PAyload",payload);
      req.payload = payload;
      // res.json({ payload })
      next();
    });
  },



  signRefreshToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = {
        name: "pranav",
      };
      const secret = process.env.REFRESH_TOKEN_SECRET;
      const options = {
        expiresIn: "1y",
        issuer: "RentalZone.com",
        audience: userId,
      };

      JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
          console.log(err.message);
          reject(createErrors.InternalServerError());
        }
        resolve(token);
      });
    });
  },


 
   
}
