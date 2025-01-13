const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const mime = require("mime-types");

// Tạo storage cho từng loại upload
const storageChecklist = (uploadFolderKey) =>
  multer.diskStorage({
    destination: (req, file, cb) => {

      const uploadFolderMap = {
        vattu: path.join(__dirname, "..", "public", "vattu"),
      };

      const uploadFolder = uploadFolderMap[uploadFolderKey];
      if (!uploadFolder) {
        return cb(new Error("Invalid upload folder key"), null);
      }
      const projectFolder = path.join(uploadFolder);

      if (!fs.existsSync(projectFolder)) {
        fs.mkdirSync(projectFolder, { recursive: true });
      }

      cb(null, projectFolder);
    },
    filename: (req, file, cb) => {
      // Thêm ngày tháng năm vào tên ảnh
      const date = new Date();
      const formattedDate = `${date.getFullYear()}_${(date.getMonth() + 1).toString().padStart(2, '0')}_${date.getDate().toString().padStart(2, '0')}`;
      const filename = `${formattedDate}_${Date.now()}${path.extname(file.originalname)}`;
      cb(null, filename);
    },
  });

const uploadVatTu = multer({
  storage: storageChecklist("vattu"),
});

// Kiểm tra tính hợp lệ của file ảnh
const validateImage = (filePath) => {
  const mimeType = mime.lookup(filePath);
  const allowedTypes = ["image/png", "image/jpeg", "image/gif"];

  if (!allowedTypes.includes(mimeType)) {
    throw new Error(`Invalid file type: ${mimeType}`);
  }

  const stats = fs.statSync(filePath);
  if (stats.size === 0) {
    throw new Error("File is empty");
  }
};

// Hàm xử lý resize ảnh
const resizeImage = async (req, res, next) => {
  try {
    if (req.files && req.files.length > 0) {
      const resizeResults = await Promise.allSettled(
        req.files.map(async (file) => {
          const originalPath = file.path;
          try {
            // Kiểm tra file ảnh hợp lệ
            validateImage(originalPath);

            // Resize và lưu ảnh
            const buffer = await sharp(originalPath)
              .resize(800, 650, { fit: sharp.fit.inside, withoutEnlargement: true })
              .jpeg({ quality: 90 }) // Chuyển sang JPEG để tối ưu
              .toBuffer();

            fs.writeFileSync(originalPath, buffer); // Ghi đè file gốc
            console.log(`Resized image: ${originalPath}`);
          } catch (err) {
            console.error(`Error resizing image ${originalPath}:`, err.message);
            throw err;
          }
        })
      );

      // Kiểm tra kết quả xử lý
      const failed = resizeResults.filter((result) => result.status === "rejected");
      if (failed.length > 0) {
        console.error("Some images failed to resize:", failed);
        return res.status(500).json({ error: "Some images failed to resize." });
      }
    }

    // Tất cả ảnh đã xử lý xong
    next();
  } catch (err) {
    console.error("Error during image processing:", err.message);
    res.status(500).json({ error: "An unexpected error occurred during image processing." });
  }
};

module.exports = {
  uploadVatTu,
  resizeImage,
};
