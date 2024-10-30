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
      type: DataTypes.TEXT,
    },
    Developer: {
      type: DataTypes.TEXT,
    },
    Type: {
      type: DataTypes.TEXT,
    },
    CurrentStatus: {
      type: DataTypes.TEXT,
    },
    Address: {
      type: DataTypes.TEXT,
    },
    Commune: {
      type: DataTypes.TEXT,
    },
    District: {
      type: DataTypes.TEXT,
    },
    Province: {
      type: DataTypes.TEXT,
    },
    Price: {
      type: DataTypes.TEXT,
    },
    LandArea: {
      type: DataTypes.TEXT,
    },
    NoOfArea: {
      type: DataTypes.TEXT,
    },
    NoOfTowers: {
      type: DataTypes.TEXT,
    },
    Grade: {
      type: DataTypes.TEXT,
    },
    NoOfStories: {
      type: DataTypes.TEXT,
    },
    NoOfBasements: {
      type: DataTypes.TEXT,
    },
    ConstructionArea: {
      type: DataTypes.TEXT,
    },
    GFA: {
      type: DataTypes.TEXT,
    },
    TotalBasementArea: {
      type: DataTypes.TEXT,
    },
    NFA: {
      type: DataTypes.TEXT,
    },
    OfficeArea: {
      type: DataTypes.TEXT,
    },
    RetailArea: {
      type: DataTypes.TEXT,
    },
    AptArea: {
      type: DataTypes.TEXT,
    },
    Chudautu: {
      type: DataTypes.TEXT,
    },
    Banquantri: {
      type: DataTypes.TEXT,
    },
    Thongtinlienhe: {
      type: DataTypes.TEXT,
    },
    Tiendotiepcankhachhang: {
      type: DataTypes.TEXT,
    },
    ConstructionCompany: {
      type: DataTypes.TEXT,
    },

    ArchitectureFirm: {
      type: DataTypes.TEXT,
    },
    ManagementCompany: {
      type: DataTypes.TEXT,
    },
    BuildingComitee: {
      type: DataTypes.TEXT,
    },
    Ghichu: {
      type: DataTypes.TEXT,
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
