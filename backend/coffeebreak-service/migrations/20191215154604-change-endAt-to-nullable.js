'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.renameColumn('Coffeebreaks', 'endAt', 'endAt', {
            allowNull: true,
            type: Sequelize.DATE
        })
      },
      down: (queryInterface, Sequelize) => {
        return queryInterface.renameColumn('Coffeebreaks', 'endAt', 'endAt', {
            type: Sequelize.DATE
      })
    }
};
