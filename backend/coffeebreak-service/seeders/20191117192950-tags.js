"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    const categories = [
      "Daily Life",
      "Food",
      "Gaming",
      "Fashion",
      "Science",
      "Culture",
      "Traveling",
      "Whatever"
    ];

    const tags = categories.map(name => {
      return {
        name: name,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });

    return queryInterface.bulkInsert("Tags", tags, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Tags", null, {});
  }
};
