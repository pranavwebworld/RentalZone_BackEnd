var express = require("express");
var app = express();
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const createErrors = require("http-errors");
const cors = require('cors')
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var vendorsRouter = require("./routes/vendors");
var adminRouter = require("./routes/users");
const authRoute = require("./routes/auth");
const chatRouter = require('./routes/chat')
const morgan = require("morgan");
require("dotenv").config();
require('./helpers/init_mongodb')






app.use(cors({ origin: ["http://localhost:3000"], credentials: true }))

app.use(morgan('dev'))
app.use(logger("dev"));
app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({ limit:'50mb',  extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));


app.use("/api", indexRouter);
app.use("/api/users", usersRouter);
app.use("/api/admin", adminRouter);
app.use("/api/vendors", vendorsRouter);
app.use("api/auth", authRoute)
app.use("/api/chat", chatRouter)


app.use(async (req, res, next) => {
//   const error = new Error("not found");
//   error.status = 404;
  next(createErrors.NotFound("This route does not exist"));
});



app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {

      status: err.status || 500,
      message: err.message,
      
    },
  });
});

module.exports = app;
