"use strict";

//---------------------------------- PORTS -----------------------------------------/*/
/* :4200 -> Angular Frontend
/* :4201 -> API Gateway
/* :4202 -> AuthService
/* :4203 -> UserSettingsService
/* :4204 -> CoffeeBreakerService
/* :4205 -> MessageboardService
/* :4206 -> NewsService
//----------------------------------------------------------------------------------/*/

const express = require("express");
const app = express();
const expressSwagger = require("express-swagger-generator")(app);
const cors = require("cors");
const https = require("https");
const fs = require("fs");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const request = require("request");

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

let swaggerOptions = {
  swaggerDefinition: {
    info: {
      description: "Coffeebreaker API Server",
      title: "Coffeebreaker API",
      version: "1.0.0"
    },
    host: "localhost:4201",
    basePath: "/v1",
    produces: ["application/json", "application/xml"],
    schemes: ["https"],
    securityDefinitions: {
      JWT: {
        type: "apiKey",
        in: "header",
        name: "Authorization",
        description: ""
      }
    }
  },
  basedir: __dirname, //app absolute path
  files: ["./server.js"] //Path to the API handle folder
};
expressSwagger(swaggerOptions);

app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "5mb", type: "application/json" }));

// ------------------------------------------------ Models ------------------------------------------------ //
/**
 * @typedef LoginCredentials
 * @property {string} username.required
 * @property {string} password.required
 */

/**
 * @typedef User
 * @property {number} id.required
 * @property {string} username.required
 * @property {string} password.required
 * @property {string} email.required
 * @property {string} interests
 * @property {string} coffeeType.required
 * @property {string} profilePicture
 */

 /**
 * @typedef User_POST
 * @property {string} username.required
 * @property {string} password.required
 * @property {string} email.required
 * @property {string} interests
 * @property {string} coffeeType.required
 */

 /**
 * @typedef Auth_Response
 * @property {string} success
 * @property {string} authtoken
 */

 /**
 * @typedef Logout_Response
 * @property {string} success
 */

/**
 * @typedef CoffeebreakUser
 * @property {integer} id.required
 * @property {string} username.required
 * @property {string} interests
 * @property {string} coffeeType.required
 * @property {string} profilePicture
 */

/**
 * @typedef Message
 * @property {string} message.required
 * @property {CoffeebreakUser.model} user.required
 * @property {integer} coffeebreakId.required
 * @property {string} createdAt
 */

/**
 * @typedef Coffeebreak
 * @property {integer} id.required
 * @property {string} title
 * @property {string} venue.required
 * @property {integer} maxParticipants.required
 * @property {string} startAt.required
 * @property {string} endAt
 * @property {Array.<CoffeebreakUser>} users.required
 * @property {Array.<Tag>} tags.required
 */

/**
 * @typedef CoffeebreakAndUser
 * @property {Coffeebreak.model} coffeebreak.required
 * @property {CoffeebreakUser.model} user.required
 */

/**
 * @typedef Tag
 * @property {integer} id.required
 * @property {string} name.required
 */

//------------------------------------------------- Returne Types------------------------------------------//
/**
 * @typedef NewsArticle
 * @property {string} author
 * @property {string} content
 * @property {string} description
 * @property {string} publishedAt
 * @property {string} source
 * @property {string} id
 * @property {string} title
 * @property {string} url
 * @property {string} urlToImage
 */

// ------------------------------------------------ Routes ------------------------------------------------ //

// ------------------------------------------------ Auth-Service -----------------------------------------

/**
 * Login a user with username and password
 * @route POST /auth/login
 * @group auth - Authentication operations
 * @param {LoginCredentials.model} loginCredentials.body.required - the user's login credentials
 * @returns {object} An object including the auth token
 * @returns {Error}  Http 400 - Bad Request if user credentials are not correct
 */
app.post("/v1/auth/login", (req, res) => {
  genericRequestWithPayload(
    "",
    "POST",
    "http://localhost:4202/login",
    JSON.stringify(req.body),
    res
  );
});

/**
 * Logout a user
 * @route GET /auth/logout
 * @group auth - Authentication operations
 * @security JWT
 * @returns {Logout_Response.model} //TODO
 */
app.get("/v1/auth/logout", (req, res) => {
  const token = req.headers["x-access-token"] || req.headers["authorization"];
  genericRequest(token, "GET", "http://localhost:4202/logout", res);
});

/**
 * Check a token for validity
 * @route GET /auth/checkToken
 * @group auth - Authentication operations
 * @security JWT
 * @returns {Auth_Response.model} //TODO
 */
app.get("/v1/auth/checkToken", (req, res) => {
  const token = req.headers["x-access-token"] || req.headers["authorization"];
  genericRequest(token, "GET", "http://localhost:4202/checkToken", res);
});

// ------------------------------------------------ User-Service -----------------------------------------

/**
 * Get the currently logged in user
 * @route GET /currentUser
 * @group auth - Authentication operations
 * @security JWT
 * @returns {User.model} Userdata of the currently logged in user
 */
app.get("/v1/currentUser", (req, res) => {
  const token = req.headers["x-access-token"] || req.headers["authorization"];
  genericRequest(token, "GET", "http://localhost:4202/currentUser", res);
});

/**
 * Register a new user
 * @route POST /user
 * @group user - User operations
 * @param {User_POST.model} User_POST.body.required - the new user data
 * @returns {User.model} The newly created user
 * @returns {Error}  Bad Request if username already exists
 */
app.post("/v1/user", (req, res) => {
  genericRequestWithPayload(
    "",
    "POST",
    "http://localhost:4203/user",
    JSON.stringify(req.body),
    res
  );
});

/**
 * Get userdata for a given user id
 * @route GET /user
 * @group user - User operations
 * @param {integer} id.query.required - id of the user that should be requested
 * @security JWT
 * @returns {User.model} User with the given id 
 * @returns {Error}  Bad Request if user does not exist
 */
app.get("/v1/user", (req, res) => {
  const token = req.headers["x-access-token"] || req.headers["authorization"];
  genericRequest(
    token,
    "GET",
    "http://localhost:4203/user/" + req.query.id,
    res
  );
});

/**
 * Update a user
 * @route PUT /user
 * @group user - User operations
 * @param {User.model} User.body.required - the new user data
 * @security JWT
 * @returns {Auth_Response.model} The updated user
 * @returns {Error}  Bad Request if user does not exist
 */
app.put("/v1/user", (req, res) => {
  const token = req.headers["x-access-token"] || req.headers["authorization"];
  genericRequestWithPayload(
    token,
    "PUT",
    "http://localhost:4203/user",
    JSON.stringify(req.body),
    res
  );
});

/**
 * Delete a user
 * @route DELETE /user
 * @group user - User operations
 * @param {integer} id.query.required - id of the user that should be deleted
 * @security JWT
 * @returns {object} //TODO
 */
app.delete("/v1/user", (req, res) => {
  //TODO: Not implemented on server side. Further testing required
  const token = req.headers["x-access-token"] || req.headers["authorization"];
  genericRequest(
    token,
    "DELETE",
    "http://localhost:4203/user/" + req.query.id,
    res
  );
});

// ------------------------------------------------ Message-Board-Service -----------------------------------------

/**
 * Get all messages of a specific coffee break
 * @route GET /coffeebreak/messages
 * @group messages - Message operations
 * @param {integer} id.query.required - coffeebreak ID
 * @security JWT
 * @returns {Array.<Message>} messages of a coffee break
 * @returns {Error}  //TODO
 */
app.get("/v1/coffeebreak/messages", (req, res) => {
  //TODO: Route implementation unclear
  const token = req.headers["x-access-token"] || req.headers["authorization"];
  genericRequest(
    token,
    "GET",
    "http://localhost:4205/coffeebreak/" + req.query.id + "/messages",
    res
  );
});

/**
 * Create a new message for a specific coffee break
 * @route POST /coffeebreak/message
 * @group messages - Message operation
 * @param {Message.model} Message.body.required - the new message data
 * @security JWT
 * @returns {object} //TODO
 */
app.post("/v1/coffeebreak/message", (req, res) => {
  //TODO: Route implementation unclear
  const token = req.headers["x-access-token"] || req.headers["authorization"];
  genericRequestWithPayload(
    token,
    "POST",
    "http://localhost:4205/coffeebreak/message",
    JSON.stringify(req.body),
    res
  );
});

// ------------------------------------------------ Coffeebreak-Service -----------------------------------------

/**
 * Get all coffeebreaks
 * @route GET /allcoffeebreaks
 * @group coffeebreak - Coffeebreak operation
 * @security JWT
 * @returns {Array.<Coffeebreak>} Array of coffeebreaks
 * @returns {Error} Error: Empty array
 */
app.get("/v1/allcoffeebreaks", (req, res) => {
  const token = req.headers["x-access-token"] || req.headers["authorization"];
  genericRequest(token, "GET", "http://localhost:4204/allcoffeebreaks", res);
});

/**
 * Get a specific coffeebreak
 * @route GET /coffeebreak
 * @group coffeebreak - Coffeebreak operation
 * @param {integer} id.query.required - coffeebreak ID
 * @security JWT
 * @returns {Coffeebreak.model} coffeebreak
 */
app.get("/v1/coffeebreak", (req, res) => {
  const token = req.headers["x-access-token"] || req.headers["authorization"];
  genericRequest(
    token,
    "GET",
    "http://localhost:4204/coffeebreak/" + req.query.id,
    res
  );
});

/**
 * Create a new coffeebreak
 * @route POST /coffeebreak
 * @group coffeebreak - Coffeebreak operation
 * @param {Coffeebreak.model} Coffeebreak.body.required - new coffeebreak data
 * @security JWT
 * @returns {Coffeebreak.model} new created coffeebreak
 */
app.post("/v1/coffeebreak", (req, res) => {
  const token = req.headers["x-access-token"] || req.headers["authorization"];
  genericRequestWithPayload(
    token,
    "POST",
    "http://localhost:4204/coffeebreak",
    JSON.stringify(req.body),
    res
  );
});

/**
 * Add user to coffeebreak
 * @route POST /addCoffeebreakUser
 * @group coffeebreak - Coffeebreak operation
 * @param {CoffeebreakAndUser.model} CoffeebreakAndUser.body.required
 * @security JWT
 * @returns {Coffeebreak.model} updated coffeebreak
 */
app.post("/v1/addCoffeebreakUser", (req, res) => {
  const token = req.headers["x-access-token"] || req.headers["authorization"];
  genericRequestWithPayload(
    token,
    "POST",
    "http://localhost:4204/addCoffeebreakUser",
    JSON.stringify(req.body),
    res
  );
});

//TODO Swagger Rest-call does not work
/**
 * Remove user from Coffeebreak
 * @route POST /removeCoffeebreakUser
 * @group coffeebreak - Coffeebreak operation
 * @param {CoffeebreakAndUser.model} CoffeebreakAndUser.body.required
 * @security JWT
 * @returns {Coffeebreak.model} updated coffeebreak
 */
app.post("/v1/removeCoffeebreakUser", (req, res) => {
  const token = req.headers["x-access-token"] || req.headers["authorization"];
  genericRequestWithPayload(
    token,
    "POST",
    "http://localhost:4204/removeCoffeebreakUser",
    JSON.stringify(req.body),
    res
  );
});

/**
 * Get all tags
 * @route GET /tags
 * @group coffeebreak - Coffeebreak operation
 * @security JWT
 * @returns {Array.<Tag>} Array of tags
 */
app.get("/v1/tags", (req, res) => {
  const token = req.headers["x-access-token"] || req.headers["authorization"];
  genericRequest(token, "GET", "http://localhost:4204/tags", res);
});

// /**
//  * Change a coffee break
//  * @route PUT /coffeeBreak/:coffeeBreak
//  * @group coffee break - Coffeebreak operation
//  * @returns {object} //TODO
//  * @returns {Error}  //TODO
//  */
// app.put("/v1/coffeeBreak/:coffeeBreak", (req, res) => {
//     //TODO: Not implemented on server side. Further testing required
//     const token = req.headers["x-access-token"] || req.headers["authorization"];
//     genericRequestWithPayload(token, "PUT", "http://localhost:4204/coffeeBreak/" + req.params.coffeeBreak, JSON.stringify(req.body), res);
// });

// /**
//  * Delete a coffee break
//  * @route DELETE /coffeeBreak/:coffeeBreak
//  * @group coffee break - Coffeebreak operation
//  * @param {CoffeeBreak.model} CoffeeBreak.body.required - the new coffee break data
//  * @returns {object} //TODO
//  * @returns {Error}  //TODO
//  */
// app.delete("/v1/coffeeBreak/:coffeeBreak", (req, res) => {
//     //TODO: Not implemented on server side. Further testing required
//     const token = req.headers["x-access-token"] || req.headers["authorization"];
//     genericRequestWithPayload(token, "PUT", "http://localhost:4204/coffeeBreak/" + req.params.coffeeBreak, res);
// });

// ------------------------------------------------ News-Service -----------------------------------------

/**
 * Get the news for specific topics
 * @route POST /news
 * @group news - Get news by topic tags
 * @param {Array.<Tag>} Tags.body.required array of tags to find news for
 * @returns {Array.<NewsArticle>} Returns an array with news articles
 */
app.post("/v1/news", (req, res) => {
  genericRequestWithPayload("", "POST", "http://localhost:4206/v1/news", JSON.stringify(req.body), res);
});

// ------------------------------------------------ Helper ------------------------------------------------

const genericRequest = (token, method, uri, res) => {
  request(
    {
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      uri: uri,
      method: method
    },
    function(error, response, body) {
      genericCallback(error, response, body, res);
    }
  );
};

const genericRequestWithPayload = (token, method, uri, body, res) => {
  request(
    {
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      uri: uri,
      method: method,
      body: body
    },
    function(error, response, body) {
      genericCallback(error, response, body, res);
    }
  );
};

const genericCallback = (error, response, body, res) => {
  if (error) {
    res.sendStatus("400");
  } else {
    if (response.statusCode === 200) {
      let data = JSON.parse(body);
      res.json(data);
    } else if (response.statusCode === 401) {
      let out = "The request is unauthorized";
      res.status("401").json(out);
    } else {
      let out = "Bad request";
      res.status("400").json(out);
    }
  }
};

//TODO: Can possibly improve this to use a predefined port by environment variable. Does that make sense in the context of Docker/ CI-CD ?
const port = process.env.PORT || 4201;
https
  .createServer(
    {
      key: fs.readFileSync("./util/cert/server.key"),
      cert: fs.readFileSync("./util/cert/server.cert")
    },
    app
  )
  .listen(port, function() {
    console.log(`Api Gateway is listening on port: ${port}`);
  });
