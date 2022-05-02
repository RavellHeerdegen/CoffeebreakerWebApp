"use strict";
const request = require("request");

//User validation
function validateToken(req, res, next) {
  const token = req.headers["x-access-token"] || req.headers["authorization"];

  request(
    {
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      uri: "http://localhost:4202/checkToken",
      method: "GET"
    },
    function(error, response, body) {
      if (error) {
        res.status(response.statusCode).send("Error in auth-service: " + error);
      } else {
        let data = JSON.parse(body);
        //Set refreshed token as property to request object
        req.authtoken = data.token;
        if (data.success) {
          next();
        } else {
          res.status(401).json("The request is unauthorized");
        }
      }
    }
  );
}

module.exports = validateToken;
