"use strict";
var moment = require("moment");

const Coffeebreak = require("../models").Coffeebreak;
const Tag = require("../models").Tag;
const User = require("../models").User;

const auth = require("../shared/middleware/validateToken");

function activateRoutes(app) {
  // create coffeebreak
  app.post("/coffeebreak", auth, async (req, res) => {
    try {
      let postdata = req.body;

      let coffeebreak = await Coffeebreak.create({
        title: postdata.title,
        venue: postdata.venue,
        startAt: postdata.startAt,
        endAt: postdata.endAt,
        maxParticipants: postdata.maxParticipants
      });

      await coffeebreak.addUser(postdata.users[0].id);
      await coffeebreak.addTags(postdata.tags.map(tag => tag.id));

      let coffeebreakNew = await Coffeebreak.findOne({
        where: {
          id: coffeebreak.id
        },
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [
          {
            model: Tag,
            attributes: ["id", "name"],
            through: { attributes: [] }
          },
          {
            model: User,
            attributes: [
              "id",
              "username",
              "interests",
              "coffeeType",
              "profilePicture"
            ],
            through: { attributes: [] }
          }
        ]
      });

      coffeebreakNew.dataValues.Users = coffeebreakNew.dataValues.Users.map(
        user => {
          user.dataValues.profilePicture = user.dataValues.profilePicture.toString(
            "utf8"
          );
          return user;
        }
      );

      res.json({
        success: true,
        authtoken: req.authtoken,
        created: coffeebreakNew
      });
    } catch (error) {
      console.log(error);
      res.sendStatus("400");
    }
  });

  // get single coffeebreak with tags and users
  app.get("/coffeebreak/:id", auth, async (req, res) => {
    let id = req.params.id;

    let coffeebreak = await Coffeebreak.findOne({
      where: {
        id: id
      },
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: Tag,
          attributes: ["id", "name"],
          through: { attributes: [] }
        },
        {
          model: User,
          attributes: [
            "id",
            "username",
            "interests",
            "coffeeType",
            "profilePicture"
          ],
          through: { attributes: [] }
        }
      ]
    });

    coffeebreak.dataValues.Users = coffeebreak.dataValues.Users.map(user => {
      user.dataValues.profilePicture = user.dataValues.profilePicture.toString(
        "utf8"
      );
      return user;
    });

    res.json({
      read: coffeebreak,
      authtoken: req.authtoken
    });
  });

  // add user to coffeebreak
  app.post("/addCoffeebreakUser", auth, async (req, res) => {
    let postdata = req.body;

    let coffeebreak = await Coffeebreak.findOne({
      where: {
        id: postdata.coffeebreak.id
      },
      include: [{ model: Tag }, { model: User }]
    });

    await coffeebreak.addUser(postdata.user.id);

    coffeebreak = await Coffeebreak.findOne({
      where: {
        id: postdata.coffeebreak.id
      },
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: Tag,
          attributes: ["id", "name"],
          through: { attributes: [] }
        },
        {
          model: User,
          attributes: [
            "id",
            "username",
            "interests",
            "coffeeType",
            "profilePicture"
          ],
          through: { attributes: [] }
        }
      ]
    });

    coffeebreak.dataValues.Users = coffeebreak.dataValues.Users.map(user => {
      user.dataValues.profilePicture = user.dataValues.profilePicture.toString(
        "utf8"
      );
      return user;
    });

    res.json({
      read: coffeebreak,
      authtoken: req.authtoken
    });
  });

  // remove user from coffeebreak
  app.post("/removeCoffeebreakUser", auth, async (req, res) => {
    let postdata = req.body;

    let coffeebreak = await Coffeebreak.findOne({
      where: {
        id: postdata.coffeebreak.id
      },
      include: [{ model: Tag }, { model: User }]
    });

    await coffeebreak.removeUser(postdata.user.id);

    coffeebreak = await Coffeebreak.findOne({
      where: {
        id: postdata.coffeebreak.id
      },
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: Tag,
          attributes: ["id", "name"],
          through: { attributes: [] }
        },
        {
          model: User,
          attributes: [
            "id",
            "username",
            "interests",
            "coffeeType",
            "profilePicture"
          ],
          through: { attributes: [] }
        }
      ]
    });

    coffeebreak.dataValues.Users = coffeebreak.dataValues.Users.map(user => {
      user.dataValues.profilePicture = user.dataValues.profilePicture.toString(
        "utf8"
      );
      return user;
    });

    res.json({
      read: coffeebreak,
      authtoken: req.authtoken
    });
  });

  //   app.put("/coffeebreak/:id", (req, res) => {});
  //   // update coffeebreak

  //   // delete coffeebreak
  //   app.delete("/coffeebreak/:id", (req, res) => {});

  /**
   * Finds all coffeebreaks in the database and returns a list of items if one were found
   */
  app.get("/allcoffeebreaks", auth, async (req, res) => {
    let coffeebreaks = await Coffeebreak.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: Tag,
          attributes: ["id", "name"],
          through: { attributes: [] }
        },
        {
          model: User,
          attributes: [
            "id",
            "username",
            "interests",
            "coffeeType",
            "profilePicture"
          ],
          through: { attributes: [] }
        }
      ]
    });

    // console.log(coffeebreaks[0].dataValues.Users[0]);

    coffeebreaks.map(coffeebreak => {
      coffeebreak.dataValues.Users = coffeebreak.dataValues.Users.map(user => {
        user.dataValues.profilePicture = user.dataValues.profilePicture.toString(
          "utf8"
        );
        return user;
      });
      return coffeebreak;
    });

    res.json({
      read: coffeebreaks,
      authtoken: req.authtoken
    });
  });

  // // Get all coffeebreakusers
  // app.get("/allcoffeebreakusers", auth, async (req, res) => {
  //   let coffeebreakusers = await Coffeebreak.findAll({
  //     include: [{ model: User }]
  //   });

  //   res.json({
  //     read: coffeebreakusers,
  //     authtoken: req.authtoken
  //   });
  // });

  app.get("/tags", auth, async (req, res) => {
    const tags = await Tag.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] }
    });

    res.json({
      read: tags,
      authtoken: req.authtoken
    });
  });
}

module.exports = { activateRoutes };
