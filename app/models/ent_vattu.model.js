const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const Ent_VatTu = sequelize.define(
  "ent_vattu",
  {
    ID_VatTu: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    DM_VatTu: {
      type: DataTypes.TEXT,
    },
    Anh: {
      type: DataTypes.TEXT,
    },
    MaVT: {
      type: DataTypes.TEXT,
    },
    ChungLoai: {
      type: DataTypes.TEXT,
    },
    ControlType: {
      type: DataTypes.TEXT,
    },
    TuoiThoTB: {
      type: DataTypes.TEXT,
    },
    GhiChu: {
      type: DataTypes.TEXT,
    },
    Loai: {
      type: DataTypes.TEXT,
    },
    TenHang: {
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
    tableName: "ent_vattu",
  }
);

module.exports = Ent_VatTu;
