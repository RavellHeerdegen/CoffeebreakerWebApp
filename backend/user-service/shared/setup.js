const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");

//Express App Config
let app = express();

//Allow CORS, because Angular is running on a different port (4200)
const corsOptions = {
  origin: "http://localhost:4200",
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "x-xsrf-token"
  ]
};

app.use(cors(corsOptions));
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json({limit:'5mb', type:'application/json'}));
app.use(morgan("dev"));

module.exports = app;
