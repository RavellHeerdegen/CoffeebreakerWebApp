"use strict";
module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define(
    "Tag",
    {
      name: DataTypes.STRING
    },
    {}
  );
  Tag.associate = models => {
    Tag.belongsToMany(models.Coffeebreak, { through: "Coffeebreak_Tag" });
  };
  return Tag;
};
