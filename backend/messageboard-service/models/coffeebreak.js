"use strict";
module.exports = (sequelize, DataTypes) => {
  const Coffeebreak = sequelize.define(
    "Coffeebreak",
    {
      title: DataTypes.STRING,
      venue: DataTypes.STRING,
      maxParticipants: DataTypes.INTEGER,
      startAt: DataTypes.DATE,
      endAt: DataTypes.DATE
    },
    {}
  );
  Coffeebreak.associate = models => {
    Coffeebreak.hasMany(models.Message);
    Coffeebreak.belongsToMany(models.User, { through: "CoffeebreakUser" });
  };
  return Coffeebreak;
};
