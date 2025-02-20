const multer = require("multer");
const upload = multer();

module.exports = (app) => {
  const ent_user = require("../controllers/ent_user.controller.js");
  const { isAuthenticated } = require("../middleware/auth_middleware.js");

  var router = require("express").Router();

  router.post("/login", ent_user.login);
  router.post("/register", ent_user.register);
  router.get("/validate-token", [isAuthenticated], ent_user.checkAuth);

  app.use("/api/v1/user", router);
};
