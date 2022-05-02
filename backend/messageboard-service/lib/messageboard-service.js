"use strict";

const models = require("../models");
const MessageModel = models.Message;
const User = models.User;

const auth = require("../shared/middleware/validateToken");

function activateRoutes(app) {
  // Post a message
  app.post("/coffeebreak/message", auth, (req, res) => {
    //TODO: Data Validation
    let postdata = req.body;
    MessageModel.create({
      message: postdata.message,
      userId: postdata.user.id,
      coffeebreakId: postdata.coffeebreakId
    })
      .then(
        res.json({
          success: true,
          authtoken: req.authtoken
        })
      )
      .catch(err => {
        console.log(err);
        res.sendStatus("400");
      });
  });

  // Get messages
  app.get("/coffeebreak/:coffeebreakId/messages", auth, (req, res) => {
    console.log("In message-board Backend (getMessages)!");

    let coffeebreakId = req.params.coffeebreakId;

    MessageModel.findAll({
      attributes: ["id", "message", "CoffeebreakId", "createdAt"],
      include: {
        model: User,
        attributes: ["id", "username", "profilePicture"]
      },
      where: { coffeebreakId: coffeebreakId }
    })
      .then(found => {
        found.forEach(message => {
          if (message.dataValues.User.dataValues.profilePicture != null) {
            message.dataValues.User.dataValues.profilePicture = message.dataValues.User.dataValues.profilePicture.toString(
              "utf8"
            );
          }
        });
        res.json({
          messages: found,
          authtoken: req.authtoken
        });
      })
      .catch(err => {
        console.log(err);
        res.sendStatus("400");
      });
  });
}

module.exports = { activateRoutes };
("use strict");
