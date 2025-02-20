const jsonwebtoken = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const isAuthenticated = asyncHandler((req, res, next) => {
  // const token = req.cookies.token;
  const tokenFromClient =
    req.body.token || req.query.token || req.headers["authorization"];

  if (!tokenFromClient) {
    return res.status(401).json({ message: "Chưa cung cấp token" });
  }

  const bearerToken = tokenFromClient.split(" ")[1];
  jsonwebtoken.verify(bearerToken, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: `Token không hợp lệ ${err}` });
    }

    // if(user.data.isRole == 1 && user.data.isAction == 0) {
    //   return res.status(404).json({ message: `Bạn không có quyền chỉnh sửa` });
    // }

    req.user = user;
    next();
  });
});

const isAuthenticatedVattu = asyncHandler((req, res, next) => {
  // const token = req.cookies.token;
  const tokenFromClient =
    req.body.token || req.query.token || req.headers["authorization"];

  if (!tokenFromClient) {
    return res.status(401).json({ message: "Chưa cung cấp token" });
  }

  const bearerToken = tokenFromClient.split(" ")[1];
  jsonwebtoken.verify(bearerToken, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: `Token không hợp lệ ${err}` });
    }

    if(user.data.isRole == 1 && user.data.isAction == 0) {
      return res.status(404).json({ message: `Bạn không có quyền thêm mới hoặc chỉnh sửa` });
    }

    req.user = user;
    next();
  });
});


module.exports = { isAuthenticated, isAuthenticatedVattu };
