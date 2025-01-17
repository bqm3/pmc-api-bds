const multer = require("multer");
const upload = multer();
module.exports = (app) => {
  const ent_vattu = require("../controllers/ent_vattu.controller.js");
  const {
    isAuthenticated,
  } = require("../middleware/auth_middleware.js");

  const {
    uploadVatTu,
    resizeImage,
  } = require("../middleware/upload_image.js");

  var router = require("express").Router();

  router.post("/create", [isAuthenticated, uploadVatTu.any("images"), resizeImage], ent_vattu.create);
  router.get("/", ent_vattu.get);
  router.get('/search', ent_vattu.searchEntVattu);
  router.get('/tenhang', ent_vattu.getTenHang);
  router.get("/:id", [isAuthenticated], ent_vattu.getDetail);
  router.put("/update/:id", [isAuthenticated, uploadVatTu.any("images"), resizeImage], ent_vattu.update);
  router.put("/delete/:id", [isAuthenticated], ent_vattu.delete);
  

  router.post("/uploads", [isAuthenticated, upload.single('files')], ent_vattu.uploadFile)


  app.use("/api/v1/vattu", router);
};
