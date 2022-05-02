"use strict";
const auth = require("../shared/middleware/validateToken");
const models = require("../models");
const UserModel = models.User;
const b64b = require("./base64default");
const bcrypt = require("bcryptjs")
const saltRounds = 10;

function activateRoutes(app) {
  //Create / Register user
  app.post("/user", (req, res) => {
    //No token verification here
    //TODO: Keep validation in mind -> DB Service?
    let postdata = req.body;

    doHash(postdata.password).then(pwd => {
      //validity check, is this user already exisiting?
      UserModel.findOne({ where: { username: postdata.username } }).then(
        found => {
          if (found === null) {
            //Used as create here -> no id is given so this is a new entry
            UserModel.create({
              username: postdata.username,
              password: pwd,
              email: postdata.email,
              interests: postdata.interests,
              coffeeType: postdata.coffeeType,
              profilePicture: b64b.default
            })
              //TODO: Return new dataset
              .then(record => {
                res.json({
                  success: true,
                  created: record
                });
              })
              .catch(err => {
                res.sendStatus("Invalid data");
              });
          } else {
            res.status(400).json("Username already exists");
          }
        }
      );
    });
  });

  //Read
  app.get('/user/:id', auth, (req, res) => {

    let p_id = req.params.id;

    UserModel.findOne(
      {
        where: { id: p_id },
        attributes: { exclude: ["createdAt", "updatedAt"] }
      }).then((found) => {

        let _data = found.dataValues;
        let data = {
          id: _data.id,
          username: _data.username,
          email: _data.email,
          //Not sending hashed PW
          //password: _data.password,
          interests: _data.interests,
          coffeeType: _data.coffeeType,
          profilePicture: _data.profilePicture.toString('utf8')
        }

        res.json({
          read: data,
          authtoken: req.authtoken
        });

      }).catch((err) => {
        res.status("400").json({ message: "This user id does not exist" })
      });
  });

  //Update which also handles pw change
  app.put('/user', auth, (req, res) => {

    let putdata = req.body;

    //First do checkup on changed pw
    //Case: Password has not changed, i.e. arrives as empty string because password hashes do not get sent
    if (putdata.password === "") {
      UserModel.upsert({
        id: putdata.id,
        username: putdata.username,
        //No pw change
        //password: putdata.password,
        email: putdata.email,
        interests: putdata.interests,
        coffeeType: putdata.coffeeType,
        profilePicture: putdata.profilePicture
      })
        //TODO: Return new dataset
        .then((record) => {
          res.json({
            success: true,
            authtoken: req.authtoken
          })
        })
        .catch((err) => {
          res.status("400").json({ message: "Bad request" })
        });
    }
    //Case: Password has changed, hash new password and store
    else {
      doHash(putdata.password).then((pwd) => {
        //Update single dataset -> if no id would be given this is a new entry
        UserModel.upsert({
          id: putdata.id,
          username: putdata.username,
          password: pwd,
          email: putdata.email,
          interests: putdata.interests,
          coffeeType: putdata.coffeeType,
          profilePicture: putdata.profilePicture
        })
          //TODO: Return new dataset
          .then((record) => {
            res.json({
              success: true,
              authtoken: req.authtoken
            })
          })
          .catch((err) => {
            res.status("400").json({ message: "Bad request" })
          });
      });
  }
  });

//Delete
app.delete("/user/:id", auth, (req, res) => {
  let p_id = req.params.id;

  res.json("not implemented");
});
}

const doHash = myPlaintextPassword => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      bcrypt.hash(myPlaintextPassword, salt, function (err, hash) {
        if (err) {
          reject(err);
        }
        resolve(hash);
      });
    });
  });
};

function checkPassword(plainPw, hash) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(plainPw, hash, function (err, res) {
      if (err) {
        reject(err);
      }
      resolve(res)
    });
  })
}

module.exports = { activateRoutes };

// # Database
//https://sequelize.readthedocs.io/en/1.7.0/articles/express/
//var u = models.User;
// u.findAll().then((r) => {
//     r.forEach(element => {
//         console.log(element.dataValues);

//     });

// })
