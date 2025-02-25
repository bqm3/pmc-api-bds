const multer = require("multer");
const upload = multer();
module.exports = (app) => {
  const ketoan = require("../controllers/ketoan.controller.js");
  const { isAuthenticated } = require("../middleware/auth_middleware.js");
  
  var router = require("express").Router();

  router.get("/", ketoan.getAll);
  router.post("/uploads", [isAuthenticated, upload.single("files")], ketoan.uploadFile);

  app.use("/api/v1/ketoan", router);
};
