const PhiDV = require("../models/ketoan.model");
const Logs = require("../models/logs.model");
const sequelize = require("../config/db_KeToan.config");
const xlsx = require("xlsx");

exports.uploadFile = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const userData = req.user.data;
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Vui lòng tải lên tệp Excel." });
    }
    
    // Đọc dữ liệu từ tệp Excel
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    
    if (!data.length) {
      return res.status(400).json({ success: false, message: "Tệp Excel không chứa dữ liệu." });
    }
    
    const fieldMap = {
      "Tên DA": "Ten_du_an",
      "Vị trí": "vitri",
      "Căn hộ": "canho",
      "Ngày bàn giao": "ngaybangiao",
      "Chủ hộ": "chuho",
      "Diện tích": "dientich",
      "Phí DV phải nộp": "phidvphainop",
      "Phí DV đã thu": "phidvdathu",
      "Phí DV còn phải thu": "phidvphaithu",
      "Số lượng ô tô": "SLoto",
      "Phí ô tô": "phioto",
      "Phí ô tô đã thu": "phiotodathu",
      "Phí ô tô còn phải thu": "phiotophaithu",
      "Số lượng xe máy": "SLxemay",
      "Phí xe máy": "phixemay",
      "Phí xe máy đã thu": "phixmdathu",
      "Phí xe máy còn phải thu": "phixmphaithu",
      "Số lượng xe điện": "SLxedien",
      "Phí xe điện": "phixedien",
      "Phí xe điện đã thu": "phixddathu",
      "Phí xe điện còn phải thu": "phixdphaithu",
      "Số lượng xe đạp": "SLxedap",
      "Phí xe đạp": "phixedap",
      "Phí xe đạp đã thu": "phixedapdathu",
      "Phí xe đạp còn phải thu": "phixedapphaithu",
      "Tổng các khoản phải thu trong tháng": "tongphaithu_thang",
      "Nợ cũ đến đầu tháng": "nocu",
      "Tổng các khoản đã thu trong tháng": "tongdathu_thang",
      "Tổng các khoản còn phải thu trong tháng": "tongconphaithu_thang",
      "Thời gian nợ": "thoigian_no",
      "Lý do nợ": "lydo_no",
      "Điều chỉnh nợ cũ": "dieuchinh_nocu",
      "Lý do điều chỉnh": "lydo_dieuchinh",
      "Liên hệ (Email)": "Email",
      "Tháng": "thang",
      "Năm": "nam",
    };
    
    // Hàm kiểm tra định dạng ngày tháng
    const isValidDate = (dateString) => {
      if (!dateString) return false;
      
      // Kiểm tra nếu là đối tượng Date
      if (dateString instanceof Date) return !isNaN(dateString);
      
      // Nếu là chuỗi, kiểm tra với các định dạng phổ biến
      if (typeof dateString === 'string') {
        // Hỗ trợ các định dạng: DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD, YYYY/MM/DD
        const dateFormats = [
          /^\d{2}\/\d{2}\/\d{4}$/,  // DD/MM/YYYY hoặc MM/DD/YYYY
          /^\d{1,2}\/\d{1,2}\/\d{4}$/,  // D/M/YYYY hoặc M/D/YYYY
          /^\d{4}-\d{2}-\d{2}$/,     // YYYY-MM-DD
          /^\d{4}\/\d{2}\/\d{2}$/    // YYYY/MM/DD
        ];
        
        // Kiểm tra chuỗi có khớp với một trong các định dạng không
        if (!dateFormats.some(regex => regex.test(dateString.trim()))) {
          return false;
        }
        
        // Nếu định dạng phù hợp, kiểm tra ngày có hợp lệ không
        const date = new Date(dateString);
        return !isNaN(date.getTime());
      }
      
      return false;
    };
    
    // Xử lý dữ liệu
    const processedData = [];
    
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const record = {};
      
      for (const [excelField, dbField] of Object.entries(fieldMap)) {
        // Trim tiêu đề từ fieldMap
        const trimmedExcelField = excelField.trim();
        // Tìm giá trị tương ứng trong row, trim các key của row để so sánh
        const originalKey = Object.keys(row).find(key => key.trim() === trimmedExcelField) || trimmedExcelField;
        const value = row[originalKey] ?? null;
        
        // Kiểm tra trường ngày bàn giao
        if (dbField === 'ngaybangiao' && value !== null) {
          if (!isValidDate(value)) {
            await transaction.rollback();
            return res.status(400).json({
              success: false,
              message: `Lỗi ở dòng ${i + 1}: Trường "Ngày bàn giao" không đúng định dạng ngày tháng.`,
              row: row
            });
          }
        }
        
        // Lưu giá trị vào record
        record[dbField] = value;
      }
      
      processedData.push(record);
    }
    
    // Nếu cần lưu vào cơ sở dữ liệu, sử dụng bulkCreate
    await PhiDV.bulkCreate(processedData, { transaction });
    await Logs.create({
      ID_User: userData.ID_User,
      Content: "Upload phí dịch vụ",
      Ngay: new Date(),
      isDelete: 0,
    });
    
    await transaction.commit(); // Xác nhận giao dịch
    
    return res.status(200).json({
      success: true,
      message: "Tải lên và xử lý thành công.",
      data: processedData,
    });
  } catch (error) {
    await transaction.rollback();
    
    console.error("Lỗi khi xử lý tệp:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi xử lý tệp. Vui lòng thử lại.",
    });
  }
};

exports.getAll = async (req, res) => {
  try {
    const data = await PhiDV.findAll();
    return res.status(200).json({
      success: true,
      message: "Lấy thông tin thành công",
      data: data,
    });
  } catch (error) {
    console.error("Lỗi khi xử lý tệp:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi xử lý tệp. Vui lòng thử lại.",
    });
  }
}
  