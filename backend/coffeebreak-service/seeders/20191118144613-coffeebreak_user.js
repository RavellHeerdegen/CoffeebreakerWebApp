"use strict";

const User = require("../models").User;
const Coffeebreak = require("../models").Coffeebreak;
const faker = require("faker");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const coffeebreaks = await Coffeebreak.findAll();
    const users = await User.findAll();

    let data = [];

    for (const coffeebreak of coffeebreaks) {
      const rounds = faker.random.number({
        min: 1,
        max: coffeebreak.maxParticipants
      });

      for (let i = 0; i < rounds; i++) {
        const user = faker.random.arrayElement(users);

        if (
          !data.find(
            o => o.userId === user.id && o.coffeebreakId === coffeebreak.id
          )
        ) {
          data.push({
            coffeebreakId: coffeebreak.id,
            userId: user.id,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
      }
    }

    return queryInterface.bulkInsert("CoffeebreakUser", data, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("CoffeebreakUser", null, {});
  }
};
