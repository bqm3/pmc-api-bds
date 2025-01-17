const Ent_VatTu = require("../models/ent_vattu.model");
const Logs = require("../models/logs.model");
const { Op, Sequelize } = require("sequelize");
const sequelize = require("../config/db.config");
const xlsx = require("xlsx");
var path = require("path");

exports.create = async (req, res) => {
  try {
    // Create a new entry for ent_bds
    const updateData = {
      DM_VatTu: req.body?.DM_VatTu,
      Anh: req.body?.Anh,
      MaVT: req.body?.MaVT,
      ChungLoai: req.body?.ChungLoai,
      ControlType: req.body?.ControlType,
      TuoiThoTB: req.body?.TuoiThoTB,
      GhiChu: req.body?.GhiChu,
      Loai: req.body?.Loai,
      TenHang: req.body?.TenHang,
      isDelete: 0,
    };

    let missingFields = [];

    if (!updateData.DM_VatTu) missingFields.push("Danh mục vật tư");
    if (!updateData.MaVT) missingFields.push("Mã vật tư");
    if (!updateData.ChungLoai) missingFields.push("Chủng loại");
    if (!updateData.ControlType) missingFields.push("Loại điều khiển");
    
    if (missingFields.length > 0) {
      return res.status(201).json({
        message: `Dữ liệu không hợp lệ. Vui lòng nhập: ${missingFields.join(", ")}. Vui lòng kiểm tra và thử lại.`,
      });
    }
    

    // Get the first image (if available)
    const image = req?.files?.[0];

    if (image) {
      const projectFolder = path.basename(path.dirname(image.path)); // Project folder
      const filename = path.basename(image.filename); // Image file name
      updateData.Anh = `${projectFolder}/${filename}`; // Set the image path
    }

    // Create a new entry in the database
    const data = await Ent_VatTu.create(updateData);

    // Respond with success message
    res.status(200).json({
      message: "Tạo thành công!",
      data: data,
    });
  } catch (err) {
    // Handle errors
    res.status(500).json({
      message: err.message || "Lỗi! Vui lòng thử lại sau.",
    });
  }
};

exports.get = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const offset = (page - 1) * limit;

    const { count, rows } = await Ent_VatTu.findAndCountAll({
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

exports.getTenHang = async (req, res) => {
  try {
    const tenhang = await Ent_VatTu.findAll({
      attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.col('TenHang')), 'TenHang']
      ],
      where: {
        isDelete: 0
      }
    });

    const tenhangArray = tenhang.map(item => item.TenHang);
    res.status(200).json({
      TenHang: tenhangArray
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

      await Ent_VatTu.findByPk(req.params.id, {
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
  const userData = req.user.data;
  const { id } = req.params; // Lấy ID từ tham số URL
  const updateData = {
    DM_VatTu: req.body.DM_VatTu,
    Anh: req.body?.Anh,
    MaVT: req.body.MaVT,
    ChungLoai: req.body.ChungLoai,
    ControlType: req.body.ControlType,
    TuoiThoTB: req.body.TuoiThoTB,
    GhiChu: req.body.GhiChu,
    Loai: req.body.Loai,
    TenHang: req.body.TenHang,
  };

  const image = req?.files?.[0];

  if (image) {
    const projectFolder = path.basename(path.dirname(image.path));
    const filename = path.basename(image.filename);
    updateData.Anh = `${projectFolder}/${filename}`;
  }

  try {
    const [updated] = await Ent_VatTu.update(updateData, {
      where: { ID_VatTu: id },
    });

    await Logs.create({
      ID_User: userData.ID_User,
      ID_VatTu: id,
      Ngay: new Date(),
      isDelete: 0,
    });

    if (updated) {
      const updatedRecord = await Ent_VatTu.findOne({
        where: { ID_VatTu: id },
      });
      return res.status(200).json({
        message: "Cập nhật thành công!",
        data: updatedRecord,
      });
    }

    // Nếu không tìm thấy bản ghi để cập nhật
    return res.status(404).json({
      message: "Không tìm thấy bản ghi để cập nhật.",
    });
  } catch (err) {
    // Xử lý lỗi
    console.error("Update error:", err);
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
        ID_VatTu: req.params.id,
        Ngay: new Date(),
        isDelete: 0,
      });

      Ent_VatTu.update(
        { isDelete: 1 },
        {
          where: {
            ID_VatTu: req.params.id,
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

exports.searchEntVattu = async (req, res) => {
  const { search } = req.query; // Nhận tham số tìm kiếm từ query

  try {
    const results = await Ent_VatTu.findAll({
      where: {
        [Sequelize.Op.or]: [
          { DM_VatTu: { [Sequelize.Op.like]: `%${search}%` } },
          { MaVT: { [Sequelize.Op.like]: `%${search}%` } },
          { ChungLoai: { [Sequelize.Op.like]: `%${search}%` } },
          { ControlType: { [Sequelize.Op.like]: `%${search}%` } },
          { TuoiThoTB: { [Sequelize.Op.like]: `%${search}%` } },
          { Loai: { [Sequelize.Op.like]: `%${search}%` } },
          { TenHang: { [Sequelize.Op.like]: `%${search}%` } },
        ],
        isDelete: 0,
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

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Vui lòng tải lên file Excel." });
    }

    // Đọc dữ liệu từ file Excel
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    if (!data.length) {
      return res
        .status(400)
        .json({ success: false, message: "File Excel không có dữ liệu." });
    }

    // Xử lý dữ liệu: Điền thông tin thiếu
    data.forEach((item, index) => {
      if (!item["DANH MỤC VẬT TƯ (Part name)"] && index > 0) {
        item["DANH MỤC VẬT TƯ (Part name)"] =
          data[index - 1]["DANH MỤC VẬT TƯ (Part name)"];
        item["GHI CHÚ (Notes)"] == undefined
          ? (item["GHI CHÚ (Notes)"] = data[index - 1]["GHI CHÚ (Notes)"])
          : "";
      }
    });

    for (let i = 0; i < data.length; i++) {
      const record = {
        DM_VatTu: data[i]["DANH MỤC VẬT TƯ (Part name)"],
        MaVT: data[i]["Mã VT"],
        ChungLoai: data[i]["CHỦNG LOẠI (Model type)"],
        ControlType: data[i]["Control type"],
        TuoiThoTB: data[i]["\r\nTUỔI THỌ TRUNG BÌNH "] || "",
        GhiChu: data[i]["GHI CHÚ (Notes)"],
        Loai: data[i]["Loại"],
        TenHang: data[i]["Hãng"]
      };
      await Ent_VatTu.create(record);
    }

    return res
      .status(200)
      .json({ success: true, message: "Tải lên và xử lý thành công." });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi xử lý file. Vui lòng thử lại.",
    });
  }
};
