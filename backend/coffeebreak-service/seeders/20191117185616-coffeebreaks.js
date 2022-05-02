"use strict";

const faker = require("faker");

module.exports = {
  up: (queryInterface, Sequelize) => {
    const coffeebreaks = new Array(30).fill(1).map(() => {
      let startDate = faker.date.between("2019-12-01", "2020-02-15");
      let endDate = new Date(startDate.getTime());

      endDate.setTime(
        endDate.getTime() +
          faker.random.arrayElement([0.5, 1, 1.5, 2]) * 60 * 60 * 1000
      );

      return {
        title: faker.lorem.words(faker.random.number({ min: 1, max: 5 })),
        venue: faker.random.arrayElement([
          "HdM Stuttgart",
          "Holzapfel",
          "Starbucks",
          "Cooles Café",
          "Hipster Café",
          "Hard Rock Café"
        ]),
        maxParticipants: faker.random.number({ min: 2, max: 5 }),
        startAt: startDate,
        endAt: endDate,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });

    return queryInterface.bulkInsert("Coffeebreaks", coffeebreaks, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Coffeebreaks", null, {});
  }
};
