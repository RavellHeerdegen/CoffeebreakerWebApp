"use strict";
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      interests: DataTypes.TEXT,
      coffeeType: DataTypes.STRING,
      profilePicture: DataTypes.BLOB('medium')
    },
    {
      defaultScope: {
        attributes: { exclude: ["password"] }
      },
      scopes: {
        withPassword: {
          attributes: {}
        }
      }
    }
  );
  User.associate = models => {
    User.belongsToMany(models.Coffeebreak, { through: "CoffeebreakUser" });
  };
  return User;
};
