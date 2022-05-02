"use strict";

const Tag = require("../models").Tag;
const Coffeebreak = require("../models").Coffeebreak;
const faker = require("faker");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const coffeebreaks = await Coffeebreak.findAll();
    const tags = await Tag.findAll();

    let data = [];

    for (const coffeebreak of coffeebreaks) {
      const rounds = faker.random.number({ min: 1, max: 3 });

      for (let i = 0; i < rounds; i++) {
        const tag = faker.random.arrayElement(tags);

        if (
          !data.find(
            o => o.tag_id === tag.id && o.coffeebreak_id === coffeebreak.id
          )
        ) {
          data.push({
            coffeebreakId: coffeebreak.id,
            tagId: tag.id,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
      }
    }

    return queryInterface.bulkInsert("CoffeebreakTag", data, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("CoffeebreakTag", null, {});
  }
};
