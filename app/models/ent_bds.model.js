const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const Ent_bds = sequelize.define(
  "ent_bds",
  {
    ID_Bds: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    Project: {
      type: DataTypes.CHAR,
    },
    Developer: {
      type: DataTypes.CHAR,
    },
    Type: {
      type: DataTypes.CHAR,
    },
    CurrentStatus: {
      type: DataTypes.CHAR,
    },
    Address: {
      type: DataTypes.CHAR,
    },
    Commune: {
      type: DataTypes.CHAR,
    },
    District: {
      type: DataTypes.CHAR,
    },
    Province: {
      type: DataTypes.CHAR,
    },
    Price: {
      type: DataTypes.CHAR,
    },
    LandArea: {
      type: DataTypes.CHAR,
    },
    NoOfArea: {
      type: DataTypes.CHAR,
    },
    NoOfTowers: {
      type: DataTypes.CHAR,
    },
    Grade: {
      type: DataTypes.CHAR,
    },
    NoOfStories: {
      type: DataTypes.CHAR,
    },
    NoOfBasements: {
      type: DataTypes.CHAR,
    },
    ConstructionArea: {
      type: DataTypes.CHAR,
    },
    GFA: {
      type: DataTypes.CHAR,
    },
    TotalBasementArea: {
      type: DataTypes.CHAR,
    },
    NFA: {
      type: DataTypes.CHAR,
    },
    OfficeArea: {
      type: DataTypes.CHAR,
    },
    RetailArea: {
      type: DataTypes.CHAR,
    },
    AptArea: {
      type: DataTypes.CHAR,
    },
    Chudautu: {
      type: DataTypes.CHAR,
    },
    Banquantri: {
      type: DataTypes.CHAR,
    },
    Thongtinlienhe: {
      type: DataTypes.CHAR,
    },
    Tiendotiepcankhachhang: {
      type: DataTypes.CHAR,
    },
    ConstructionCompany: {
      type: DataTypes.CHAR,
    },

    ArchitectureFirm: {
      type: DataTypes.CHAR,
    },
    ManagementCompany: {
      type: DataTypes.CHAR,
    },
    BuildingComitee: {
      type: DataTypes.CHAR,
    },
    Ghichu: {
      type: DataTypes.CHAR,
    },

    isDelete: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    tableName: "ent_bds",
  }
);

module.exports = Ent_bds;
