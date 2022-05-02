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
      profilePicture: DataTypes.BLOB
    },
    {}
  );
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};
