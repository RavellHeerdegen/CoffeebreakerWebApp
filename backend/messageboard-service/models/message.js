"use strict";
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define(
    "Message",
    {
      message: DataTypes.TEXT,
      userId: DataTypes.INTEGER,
      coffeebreakId: DataTypes.INTEGER
    },
    {}
  );
  Message.associate = models => {
    Message.belongsTo(models.User);
    Message.belongsTo(models.Coffeebreak);
  };
  return Message;
};
