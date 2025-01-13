const 
  Ent_user
= require("../models/ent_user.model");
const {
  Ent_bds,
} = require("../models/ent_bds.model");
const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const { Op } = require("sequelize");
const fetch = require("node-fetch");
const moment = require("moment-timezone");
const sequelize = require("../config/db.config");
const xlsx = require("xlsx");

// Login User
exports.login = async (req, res) => {
  try {
    // Check if username and password are provided
    if (!req.body.UserName || !req.body.Password) {
      return res.status(400).json({
        message: "Sai tài khoản hoặc mật khẩu. Vui lòng thử lại!!",
      });
    }
    // Find user by username
    const user = await Ent_user.findOne({
      where: {
        UserName: req.body.UserName,
        isDelete: 0,
      },
      attributes: [
        "ID_User",
        "UserName",
        "Password",
        "isRole",
        "isDelete",
      ],
    });

    // Check if user exists and is not deleted
    if (user && user.isDelete === 0) {
      // Compare passwords
      const passwordValid = await bcrypt.compare(
        req.body.Password,
        user.Password
      );

      if (passwordValid) {
        let projects = [];
        // Generate JWT token
        const token = jsonwebtoken.sign(
          {
            data: user,
          },
          process.env.JWT_SECRET,
          {
            algorithm: "HS256",
            expiresIn: "7d",
          }
        );

        // Set token as cookie
        res.cookie("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        });

        // Return the token, user info, and projects if applicable
        return res.status(200).json({
          token: token,
          user: user,
        });
      } else {
        // Incorrect password
        return res
          .status(400)
          .json({ message: "Sai mật khẩu. Vui lòng thử lại." });
      }
    } else {
      // User not found or deleted
      return res.status(400).json({
        message:
          "Bạn không thể đăng nhập. Vui lòng nhắn tin cho phòng chuyển đổi số.",
      });
    }
  } catch (err) {
    // Internal server error
    return res.status(500).json({
      message: err ? err.message : "Lỗi! Vui lòng thử lại sau.",
    });
  }
};

exports.register = async (req, res, next) => {
  try {
    const {
      UserName,
      Password,
    } = req.body;
    if (!UserName || !Password ) {
      return res.status(400).json({
        message: "Phải nhập đầy đủ dữ liệu.",
      });
    }
    const user = await Ent_user.findOne({
      where: {
        UserName: UserName
      },
      attributes: [
        "ID_User",
        "UserName",
        "isDelete"
      ]
    
    });

    if (user !== null) {
      return res.status(401).json({
        message: "Tài khoản hoặc Email đã bị trùng.",
      });
    }

    const salt = genSaltSync(10);
    var data = {
      UserName: UserName,
      Password: await hashSync(Password, salt),
     
      isDelete: 0,
    };

    Ent_user.create(data)
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        res.status(500).json({
          message: err.message || "Lỗi! Vui lòng thử lại sau.",
        });
      });
  } catch (err) {
    console.log("err", err);
    return res.status(500).json({
      message: err.message || "Lỗi! Vui lòng thử lại sau",
    });
  }
};
//get Check auth
exports.checkAuth = async (req, res, next) => {
  try {
    const userData = req.user.data;
    
    await Ent_user.findByPk(userData.ID_User, {
      attributes: [
        "ID_User",
        "UserName",
        "Email",
        "Hoten",
        "Gioitinh",
        "Sodienthoai",
        "Ngaysinh",
        "ID_Duan",
        "ID_KhoiCV",
        "deviceToken",
        "ID_Chucvu",
      ],
      include: [
        {
          model: Ent_duan,
          attributes: [
            "ID_Duan",
            "Duan",
            "Diachi",
            "ID_Nhom",
            "ID_Chinhanh",
            "ID_Linhvuc",
            "ID_Loaihinh",
            "ID_Phanloai",
            "Vido",
            "Kinhdo",
            "Logo",
            "isDelete",
          ],
          include: [
            {
              model: ent_bds,
              as: "ent_bds",
              attributes: ["Toanha", "Sotang", "ID_Duan", "Vido", "Kinhdo"],
              where: { isDelete: 0 },
              required: false,
            },
            {
              model: Ent_nhom,
              as: "ent_nhom",
              attributes: ["Tennhom", "ID_Nhom"],
            },
          ],
        },
        {
          model: Ent_chucvu,
          attributes: ["Chucvu", "Role"],
        },
        {
          model: Ent_khoicv,
          attributes: ["KhoiCV", "Ngaybatdau", "Chuky"],
        },
      ],
      where: {
        isDelete: 0,
      },
    })
      .then((data) => {
        res.status(200).json({
          message: "Thông tin User!",
          data: data,
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: err.message || "Lỗi! Vui lòng thử lại sau.",
        });
      });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Lỗi! Vui lòng thử lại sau.",
    });
  }
};

