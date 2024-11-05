const multer = require("multer");
const upload = multer();
module.exports = (app) => {
  const ent_bds = require("../controllers/ent_bds.controller.js");
  const {
    isAuthenticated,
  } = require("../middleware/auth_middleware.js");

  var router = require("express").Router();

  router.post("/create", [isAuthenticated], ent_bds.create);
  router.get("/", ent_bds.get);
  router.get('/search', ent_bds.searchEntBds);
  router.get("/:id", [isAuthenticated], ent_bds.getDetail);
  router.put("/update/:id", [isAuthenticated], ent_bds.update);
  router.put("/delete/:id", [isAuthenticated], ent_bds.delete);
  

  router.post("/uploads", [isAuthenticated, upload.single('files')], ent_bds.uploadFile)


  app.use("/api/v1/bds", router);
};
