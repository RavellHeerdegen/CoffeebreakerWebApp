"use strict";

const faker = require("faker");
const bcrypt = require("bcryptjs");
const b64d = require("../lib/base64default")

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const saltRounds = 10;

    const users = [];

    for (const d of new Array(10)) {
      const username = faker.internet.userName();
      const hash = await bcrypt.hash("test", saltRounds);

      users.push({
        username: username,
        email:
          username +
          faker.random.arrayElement([
            "@web.de",
            "@gmx.de",
            "@gmail.com",
            "@hotmail.de"
          ]),
        password: hash,
        interests: faker.lorem.sentence(5),
        coffeeType: faker.random.arrayElement([
          "Americano",
          "Latte Macchiato",
          "Espresso",
          "Cappuccino",
          "Mochaccino",
          "Frappuccino"
        ]),
        profilePicture: b64d.default,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    return queryInterface.bulkInsert("Users", users, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  }
};
