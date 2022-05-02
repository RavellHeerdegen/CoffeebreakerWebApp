"use strict";

const User = require("../models").User;
const Coffeebreak = require("../models").Coffeebreak;
const faker = require("faker");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const coffeebreaks = await Coffeebreak.findAll();

    let data = [];

    for (const coffeebreak of coffeebreaks) {
      const rounds = faker.random.number({
        min: 1,
        max: 5
      });

      let coffeebreak_users = await Coffeebreak.findOne({
        where: {
          id: coffeebreak.id
        },
        include: [
          {
            model: User,
            attributes: ["id"]
          }
        ]
      });

      for (let i = 0; i < rounds; i++) {
        const user = faker.random.arrayElement(coffeebreak_users.Users);
        data.push({
          message: faker.lorem.text(faker.random.number({ min: 1, max: 3 })),
          coffeebreakId: coffeebreak.id,
          userId: user.id,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }

    return queryInterface.bulkInsert("Messages", data, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Messages", null, {});
  }
};
