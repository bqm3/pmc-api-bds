const Ent_bds = require("../models/ent_bds.model");
const Logs = require("../models/logs.model");
const { Op, Sequelize } = require("sequelize");
const sequelize = require("../config/db.config");
const xlsx = require("xlsx");

exports.create = (req, res) => {
  // Validate request
  if (!req.body.Project) {
    res.status(400).json({
      message: "Phải nhập đầy đủ dữ liệu!",
    });
    return;
  }

  // Create a ent_bds
  const updateData = {
    Type: req.body.Type,
    Developer: req.body.Developer,
    Project: req.body.Project,
    CurrentStatus: req.body.CurrentStatus,
    Address: req.body.Address,
    Commune: req.body.Commune,
    District: req.body.District,
    Province: req.body.Province,
    Price: req.body.Price,
    LandArea: req.body.LandArea,
    NoOfArea: req.body.NoOfArea,
    NoOfTowers: req.body.NoOfTowers,
    Grade: req.body.Grade,
    NoOfStories: req.body.NoOfStories,
    NoOfBasements: req.body.NoOfBasements,
    ConstructionArea: req.body.ConstructionArea,
    GFA: req.body.GFA,
    TotalBasementArea: req.body.TotalBasementArea,
    NFA: req.body.NFA,
    OfficeArea: req.body.OfficeArea,
    RetailArea: req.body.RetailArea,
    AptArea: req.body.AptArea,
    Chudautu: req.body.Chudautu,
    Banquantri: req.body.Banquantri,
    Thongtinlienhe: req.body.Thongtinlienhe,
    Tiendotiepcankhachhang: req.body.Tiendotiepcankhachhang,
    ConstructionCompany: req.body.ConstructionCompany,
    ArchitectureFirm: req.body.ArchitectureFirm,
    ManagementCompany: req.body.ManagementCompany,
    BuildingComitee: req.body.BuildingComitee,
    Ghichu: req.body.Ghichu,
    isDelete: 0,
  };

  // Save ent_bds in the database
  Ent_bds.create(updateData)
    .then((data) => {
      res.status(200).json({
        message: "Tạo thành công!",
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message || "Lỗi! Vui lòng thử lại sau.",
      });
    });
};

exports.get = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const offset = (page - 1) * limit;

    const { count, rows } = await Ent_bds.findAndCountAll({
      limit,
      offset,
      where: { isDelete: 0 }, // Example filter
    });

    res.json({
      data: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDetail = async (req, res) => {
  try {
    const userData = req.user.data;
    if (userData) {
      let whereClause = {
        isDelete: 0,
      };

      await Ent_bds.findByPk(req.params.id, {
        where: whereClause,
      })
        .then((data) => {
          res.status(200).json({
            message: "Danh sách!",
            data: data,
          });
        })
        .catch((err) => {
          res.status(500).json({
            message: err.message || "Lỗi! Vui lòng thử lại sau.",
          });
        });
    }
  } catch (err) {
    return res.status(500).json({
      message: err.message || "Lỗi! Vui lòng thử lại sau.",
    });
  }
};

exports.update = async (req, res) => {
  try {
    const userData = req.user.data;

    // Kiểm tra xem ID và userData có tồn tại không
    if (req.params.id && userData) {
      const updateData = {
        Type: req.body.Type,
        Developer: req.body.Developer,
        Project: req.body.Project,
        CurrentStatus: req.body.CurrentStatus,
        Address: req.body.Address,
        Commune: req.body.Commune,
        District: req.body.District,
        Province: req.body.Province,
        Price: req.body.Price,
        LandArea: req.body.LandArea,
        NoOfArea: req.body.NoOfArea,
        NoOfTowers: req.body.NoOfTowers,
        Grade: req.body.Grade,
        NoOfStories: req.body.NoOfStories,
        NoOfBasements: req.body.NoOfBasements,
        ConstructionArea: req.body.ConstructionArea,
        GFA: req.body.GFA,
        TotalBasementArea: req.body.TotalBasementArea,
        NFA: req.body.NFA,
        OfficeArea: req.body.OfficeArea,
        RetailArea: req.body.RetailArea,
        AptArea: req.body.AptArea,
        Chudautu: req.body.Chudautu,
        Banquantri: req.body.Banquantri,
        Thongtinlienhe: req.body.Thongtinlienhe,
        Tiendotiepcankhachhang: req.body.Tiendotiepcankhachhang,
        ConstructionCompany: req.body.ConstructionCompany,
        ArchitectureFirm: req.body.ArchitectureFirm,
        ManagementCompany: req.body.ManagementCompany,
        BuildingComitee: req.body.BuildingComitee,
        Ghichu: req.body.Ghichu,
      };

      // Cập nhật thông tin vào cơ sở dữ liệu
      const data = await Ent_bds.update(updateData, {
        where: {
          ID_Bds: req.params.id,
        },
      });

      await Logs.create({
        ID_User: userData.ID_User,
        ID_Bds: req.params.id,
        Ngay: new Date(), // Lưu thời gian cập nhật,
        isDelete: 0,
      });

      res.status(200).json({
        message: "Cập nhật thành công!!!",
        data: data,
      });
    } else {
      res.status(400).json({
        message: "ID không hợp lệ hoặc không có quyền truy cập.",
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: err.message || "Lỗi! Vui lòng thử lại sau.",
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const userData = req.user.data;
    if (userData) {
      await Logs.create({
        ID_User: userData.ID_User,
        ID_Bds: req.params.id,
        Ngay: new Date(), // Lưu thời gian cập nhật,
        isDelete: 0,
      });

      Ent_bds.update(
        { isDelete: 1 },
        {
          where: {
            ID_Bds: req.params.id,
          },
        }
      )
        .then((data) => {
          res.status(200).json({
            message: "Danh sách!",
            data: data,
          });
        })
        .catch((err) => {
          res.status(500).json({
            message: err.message || "Lỗi! Vui lòng thử lại sau.",
          });
        });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message || "Lỗi! Vui lòng thử lại sau.",
    });
  }
};

exports.searchEntBds = async (req, res) => {
  const { search } = req.query; // Nhận tham số tìm kiếm từ query

  try {
    const results = await Ent_bds.findAll({
      where: {
        [Sequelize.Op.or]: [
          { Project: { [Sequelize.Op.like]: `%${search}%` } },
          { Developer: { [Sequelize.Op.like]: `%${search}%` } },
          { Address: { [Sequelize.Op.like]: `%${search}%` } },
        ],
      },
    });
    res.json({
      data: results,
    });
  } catch (error) {
    console.error("Lỗi khi tìm kiếm:", error);
    res.status(500).json({ message: "Lỗi khi tìm kiếm dữ liệu" });
  }
};

// src/controllers/yourController.js

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    await sequelize.transaction(async (transaction) => {
      const removeSpacesFromKeys = (obj) => {
        return Object.keys(obj).reduce((acc, key) => {
          const newKey = key?.replace(/\s+/g, "")?.toUpperCase();
          acc[newKey] = obj[key];
          return acc;
        }, {});
      };

      for (const item of data) {
        const transformedItem = removeSpacesFromKeys(item);
        console.log("transformedItem", transformedItem);
        // Map each field from the Excel data to model properties
        await Ent_bds.create(
          {
            Project: transformedItem["TÊNDỰÁN/PROJECT"] || "",
            Developer: transformedItem["CHỦĐẦUTƯ/DEVELOPER"] || "",
            Type: transformedItem["LOẠIHÌNHBĐS"] || "",
            CurrentStatus: transformedItem["HIỆNTRẠNG/CURRENTSTATUS"] || "",
            Address: transformedItem["ĐỊACHỈ/ADDRESS"] || "",
            Commune: transformedItem["PHƯỜNGXÃ/COMMUNE"] || "",
            District: transformedItem["QUẬNHUYỆN/DISTRICT"] || "",
            Province: transformedItem["TỈNH/PROVINCE"] || "",
            Price: transformedItem["GIÁBÁN/PRICE"] || "",
            LandArea: transformedItem["DIỆNTÍCHĐẤT/LANDAREA(M2)"] || "",
            NoOfArea: transformedItem["SỐCĂNHỘ/NO.OFAPT."] || "",
            NoOfTowers: transformedItem["SỐTHÁP/NO.OFTOWERS"] || "",
            Grade: transformedItem["HẠNG/GRADE"] || "",
            NoOfStories: transformedItem["SỐTẦNGNỔI/NO.OFSTORIES"] || "",
            NoOfBasements: transformedItem["SỐTẦNGHẦM/NO.OFBASEMENTS"] || "",
            ConstructionArea:
              transformedItem["DIỆNTÍCHXÂYDỰNG/CONSTRUCTIONAREA"],
            GFA: transformedItem["GFA(M2)"] || "",
            TotalBasementArea:
              transformedItem["TỔNGDIỆNTÍCHTẦNGHẦM/TOTALBASEMENTAREA(M2)"] ||
              "",
            NFA: transformedItem["NFA"] || "",
            OfficeArea: transformedItem["DIỆNTÍCHVP/OFFICEAREA(M2)"] || "",
            RetailArea: transformedItem["DIỆNTÍCHTM/RETAILAREA(M2)"] || "",
            AptArea: transformedItem["DIỆNTÍCHĐỂỞ/APT.AREA(M2)"] || "",
            Chudautu: transformedItem["CHỦĐẦUTƯ"] || "",
            Banquantri: transformedItem["BANQUẢNTRỊ"] || "",
            Thongtinlienhe: transformedItem["THÔNGTINLIÊNHỆ"] || "",
            Tiendotiepcankhachhang:
              transformedItem["TIẾNĐỘTIẾP CẬNKHÁCHHÀNG"] || "",
            ConstructionCompany:
              transformedItem["CÔNGTYXÂYDỰNG/CONSTRUCTIONCOMPANY"] || "",
            ArchitectureFirm:
              transformedItem["CÔNGTYTHIẾTKẾ/ARCHITECTUREFIRM"] || "",
            ManagementCompany:
              transformedItem["CÔNGTYQUẢNLÝ/PROPERTYMANAGEMENTCOMPANY"] || "",
            BuildingComitee: transformedItem["BUILDINGCOMITEE(Y/N)"] || "",
            Ghichu: transformedItem["GHICHÚ"] || "",
            isDelete: 0, // Default value
          },
          { transaction }
        );
      }
    });

    res.send({
      message: "File uploaded and data processed successfully",
      data,
    });
  } catch (err) {
    console.log("err", err.message);
    console.error("Error at line", err.stack.split("\n")[1].trim());
    return res.status(500).json({
      message: err.message || "Lỗi! Vui lòng thử lại sau.",
      error: err.stack,
    });
  }
};
