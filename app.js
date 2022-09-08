const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const expressValidator = require("express-validator");
const cors = require("cors");
const helmet = require("helmet");
const hpp = require("hpp");
const mongoSanitize = require("express-mongo-sanitize");
// const Sentry = require("@sentry/node");
require("dotenv").config();
const port = process.env.APP_PORT;
const mongodbUrl = process.env.MONGODB_URL;
// const dsn = process.env.DSN;
// const cronjobs = require('');
const dev = process.env.DEV;
const releasesV = process.env.RELEASES_V;
global.logcode = "0";
global.ln = "persian";
//dsn
// Sentry.init({ dsn });
// app.use(Sentry.Handlers.requestHandler());
//Locallogger
if (dev === "false") {
  const datetime = new Date();
  const fs = require("fs");
  const util = require("util");
  if (!fs.existsSync("./debug")) {
    fs.mkdirSync("./debug");
  }
  const log_file = fs.createWriteStream(__dirname + `/debug/${datetime.toISOString().slice(0, 10)}.log`, {
    flags: "w",
  });
  const log_stdout = process.stdout;
  console.log = function (d) {
    //
    log_file.write(`\n----------${datetime}\n` + util.format(d) + "\n----------");
  };
}
// Connect to DB
mongoose.connect(mongodbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});
mongoose.Promise = global.Promise;
const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use("/api/v1/share/upload", bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: "application/json" }));

app.use(expressValidator());
app.use(helmet());
app.use(hpp());
app.use(mongoSanitize());
//get ln
const { getLn } = require("./modules/helpers/getLn");
app.use(getLn);
//
//api-v1
const publicApiV1Router = require("./modules/routes/v1/api/public");
const webHookApiV1Router = require("./modules/routes/v1/api/webHook");
const userApiV1Router = require("./modules/routes/v1/api/user");
// const shareApiV1Router = require("./modules/routes/v1/api/share");
const settingApiV1Router = require("./modules/routes/v1/api/setting");

app.use("/api/v1", publicApiV1Router);
app.use("/api/v1/webHook", webHookApiV1Router);
app.use("/api/v1/user", userApiV1Router);
// app.use("/api/v1/share", shareApiV1Router);
app.use("/api/v1/setting", settingApiV1Router);

//;

// app.use(
//   Sentry.Handlers.errorHandler({
//     shouldHandleError(error) {
//       return true;
//     },
//   })
// );
app.listen(port, () => {
  console.log(`Server is running at Port ${port}`);
  //cronjobs
  // cronjobs();
});
app.use(function (err, req, res, next) {
  console.log(err);
  res.status(500).send({
    message: {
      message: "!خطای سرور" + "\n " + res.sentry,
      field: null,
      logcode,
    },
    status: 500,
    success: false,
    v: releasesV,
  });
  next();
});
