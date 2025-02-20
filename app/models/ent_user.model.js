const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const Ent_user = sequelize.define(
  "ent_user",
  {
    ID_User: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    
    UserName: {
      type: DataTypes.CHAR,
      allowNull: false,
    },
    Password: {
      type: DataTypes.CHAR,
      allowNull: false,
    },
    isRole: {
      type: DataTypes.INTEGER,
    },
    isAction: {
      type: DataTypes.INTEGER,
    },
    isDelete: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    tableName: "ent_user",
  }
);

module.exports = Ent_user;
