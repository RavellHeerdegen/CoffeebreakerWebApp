"use strict";

const app = require("./shared/setup");
const database = require('./config/database.js')
const userService = require("./lib/user-service");

//Establish DB connection
database
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
});

userService.activateRoutes(app);
//TODO: Can possibly improve this to use a predefined port by environment variable. Does that make sense in the context of Docker/ CI-CD ?
const port = process.env.PORT || 4203;
app.listen(port, () =>
  console.log(`UserService is listening on port: ${port}`)
);

/*
CURL Test commands WINDOWS

curl -X GET http://localhost:4203/user/AgentSmith -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNTcyNTYxMjYwLCJleHAiOjE1NzI2NDc2NjB9.Q9XnO3HqxrAm552wJLhfO6jKZZ9UAXvrwbmsxkANBu4"
curl -X POST http://localhost:4203/user -H "Content-Type: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNTcyNTYxMjYwLCJleHAiOjE1NzI2NDc2NjB9.Q9XnO3HqxrAm552wJLhfO6jKZZ9UAXvrwbmsxkANBu4" -d "{\"password\":\"test\", \"username\":\"test\", \"firstName\":\"test\", \"lastName\":\"lastName\"}"
curl -X PUT http://localhost:4203/user/AgentSmith -H "Content-Type: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNTcyNTYxMjYwLCJleHAiOjE1NzI2NDc2NjB9.Q9XnO3HqxrAm552wJLhfO6jKZZ9UAXvrwbmsxkANBu4" -d "{\"password\":\"test\", \"username\":\"test\", \"firstName\":\"test\", \"lastName\":\"lastName\"}"
curl -X DELETE http://localhost:4203/user/AgentSmith -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNTcyNTYxMjYwLCJleHAiOjE1NzI2NDc2NjB9.Q9XnO3HqxrAm552wJLhfO6jKZZ9UAXvrwbmsxkANBu4"

*/
