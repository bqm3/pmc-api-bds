const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const Logs = sequelize.define(
  "logs",
  {
    ID_Log: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },

    ID_User: {
      type: DataTypes.INTEGER,
    },
    ID_Bds: {
      type: DataTypes.INTEGER,
    },
    ID_VatTu: {
      type: DataTypes.INTEGER,
    },
    Ngay: {
      type: DataTypes.DATE,
    },
    isDelete: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    tableName: "logs",
  }
);

module.exports = Logs;
