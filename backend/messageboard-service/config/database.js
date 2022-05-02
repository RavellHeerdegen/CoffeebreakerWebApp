"use strict";

const Sequelize = require("sequelize");

module.exports = new Sequelize("coffeebreaker", "root", null, {
  host: "localhost",
  dialect: "mariadb"
});
