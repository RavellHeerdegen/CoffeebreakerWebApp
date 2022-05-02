"use strict";

let jwt = require("jsonwebtoken");
let priv = require("./priv");
let bcrypt = require("bcryptjs");
const models = require("../models");
const UserModel = models.User;

class AuthService {
  login(req, res) {
    // Credentials provided by user
    let p_username = req.body.username;
    let p_password = req.body.password;

    UserModel.findOne({ where: { username: p_username } }).then((found) => {
      let db_user = found.dataValues.username
      let db_pwd_hash = found.dataValues.password

      if (p_username && p_password) {
        checkPassword(p_password, db_pwd_hash).then((checked) => {
          if (p_username === db_user && checked) {
            //Credentials are correct -> deliver token to client
            let token = jwt.sign({ username: db_user }, priv.secret,
              //TODO: What expiration date would make sense here? -> See experimental changes to validateToken
              {
                expiresIn: '30m'
              }
            );
            res.json({
              success: true,
              message: 'Authentication successful!',
              user: db_user,
              token: token
            });
          } else {
            //Wrong credentials provided
            res.status(400).json({
              success: false,
              message: 'Incorrect username or password'
            });
          }
        });
      } else {
        //No credentials provided
        res.status(400).json({
          success: false,
          message: 'Authentication failed! Please check the request'
        });
      }
    }).catch((err) => {
      res.status(400).send({
        message: 'Bad Credentials'
     });
    })
  }
  //Experimental: Also "refreshes" token, i.e. signs a new token and sends it to the client
  validateToken(req, res) {
    let token = req.headers["x-access-token"] || req.headers["authorization"]; // Express headers are auto converted to lowercase
    const newtoken = reSignToken(token);

    res.json({
      success: true,
      token: newtoken,
      message: "Token is valid, receive refreshed token"
    });
  }
  //TODO: Invalidate JWT from server side
  //Apparently there is no simple approach to invalidate the token. Keep expiry date kinda low? 1 hour?
  //Could also use a blacklist. Is this really worth the effort?
  logout(req, res) {
    res.json({
      success: true
    });
  }
  currentUser(req, res) {
    let token = req.headers["x-access-token"] || req.headers["authorization"]; // Express headers are auto converted to lowercase
    let user = getDecodedUser(token);
    const newtoken = reSignToken(token);

    UserModel.findOne({ where: { username: user } }).then(found => {
      let _data = found.dataValues;
      let data = {
        id: _data.id,
        username: _data.username,
        email: _data.email,
        password: _data.password,
        interests: _data.interests,
        coffeeType: _data.coffeeType,
        profilePicture: _data.profilePicture.toString("utf8")
      };

      res.json({
        currentUser: data,
        authtoken: newtoken
      });
    });
  }
}

function checkPassword(plainPw, hash) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(plainPw, hash, function(err, res) {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
}

function getDecodedUser(token) {
  let newtoken;

  if (token.startsWith("Bearer ")) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }

  jwt.verify(token, priv.secret, (err, decoded) => {
    if (err) {
      return err;
    }
    newtoken = decoded.username;
  });

  return newtoken;
}

function reSignToken(token) {
  let newtoken;

  if (token.startsWith("Bearer ")) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }

  jwt.verify(token, priv.secret, (err, decoded) => {
    newtoken = jwt.sign({ username: decoded.username }, priv.secret, {
      expiresIn: "30m"
    });
  });
  return newtoken;
}

module.exports = {
  AuthService: AuthService
};
