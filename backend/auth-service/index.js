"use strict";
const app = require("./shared/setup");
const database = require('./config/database.js')
const middleware = require("./lib/middleware");
const authService = require("./lib/auth-service");
const AuthService = authService.AuthService;

//Use instance of AuthService to protect routes for the AuthService
const handlers = new AuthService();

//Establish DB connection
database
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
});

//TODO: Can possibly improve this to use a predefined port by environment variable. Does that make sense in the context of Docker/ CI-CD ?
const port = process.env.PORT || 4202;
app.listen(port, () =>
  console.log(`AuthService is listening on port: ${port}`)
);

//Supplied routes:
/*
  /login : Provide credentials to receive a token
  /checkToken : Validate Token (use from other services; server side)
  /logout : Delete/Invalidate Token (does not really delete it from server...)
*/
app.post("/login", handlers.login);
app.get("/logout", middleware.checkToken, handlers.logout);
app.get("/checkToken", middleware.checkToken, handlers.validateToken);
app.get("/currentUser", middleware.checkToken, handlers.currentUser);

/*
Original blueprint

https://medium.com/dev-bits/a-guide-for-adding-jwt-token-based-authentication-to-your-single-page-nodejs-applications-c403f7cf04f4
*/

/*
CURL test comannds WINDOWS


curl -X GET http://localhost:4202/checkToken
// --> invalid token
curl -H "Content-Type: application/json" -X POST http://localhost:4202/login -d "{\"password\":\"password\", \"username\":\"admin\"}" 
// --> 200, receive token
curl -X GET -H "Authorization: Bearer <received_token>" http://localhost:4202/checkToken
//Logout
curl -X GET -H "Authorization: Bearer <received_token>" http://localhost:4202/logout

*/
