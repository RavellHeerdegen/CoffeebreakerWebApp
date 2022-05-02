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
    {}
  );
  User.associate = models => {
    User.hasMany(models.Message);
    User.belongsToMany(models.Coffeebreak, { through: "CoffeebreakUser" });
  };
  return User;
};
