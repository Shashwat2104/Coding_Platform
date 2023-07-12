const express = require("express");
const { UserModel } = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const tokenList = {};
express.json();
require("dotenv").config();
const userRoute = express.Router();

// const { authMiddleWare } = require("../middlewares/auth");

// const checkRole = (role) => {
//   return (req, res, next) => {
//     if (req.user.role !== role) {
//       return res.status(403).json({ error: "Access denied" });
//     }
//     next();
//   };
// };

userRoute.get("/", async (req, res) => {
  try {
    const data = await UserModel.find();
    res.send(data);
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
});

userRoute.post("/register", async (req, res) => {
  const { name, email, pass, role } = req.body;
  const check = await UserModel.find({ email });
  if (check.length > 0) {
    return res.status(200).json({ ok: false, msg: "User already exist" });
  }
  bcrypt.hash(pass, 5, async (err, hash) => {
    try {
      const data = new UserModel({ name, email, pass: hash, role });
      await data.save();

      res
        .status(200)
        .json({ ok: true, msg: "Registered Successfully", user: data });
    } catch (error) {
      res.status(400).json({ ok: false, msg: error.message });
    }
  });
});

// login route for users to get access tokens and refreshTokens from the server side using JWTs

userRoute.post("/login", async (req, res) => {
  try {
    console.log(req.body);
    const { email, pass } = req.body;
    const user = await UserModel.findOne({ email });
    console.log(user);
    if (!user) {
      return res
        .status(401)
        .json({ msg: "User with this email not found", ok: false });
    }
    const isPasswordSame = await bcrypt.compare(pass, user.pass);
    console.log(isPasswordSame);
    if (!isPasswordSame) {
      return res
        .status(401)
        .json({ msg: "Invalid email or password", ok: false });
    }
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.secret,
      {
        expiresIn: "1d",
      }
    );
    // const refreshToken = jwt.sign(
    //   { userId: user._id },
    //   process.env.refresh_secret,
    //   { expiresIn: "6d" }
    // );
    // const response = {
    //   ok: true,
    //   token: token,
    //   refreshToken: refreshToken,
    //   msg: "Login Successfull",
    //   role: user.role,
    //   approved: user.approved,
    //   id: user._id
    // };
    // tokenList[refreshToken] = response;
    // req.user = user;
    // res.status(200).json(response);
    res
      .status(200)
      .send({ msg: "Login Sucessfull", email: email, token: token });
  } catch (error) {
    res.status(400).json({ ok: false, msg: error.message });
    console.log(error);
  }
});

userRoute.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ message: err.message });
    } else {
      res.json({ message: "Logged out successfully" });
    }
  });
});

// Info of a particular user

userRoute.get("/:id", async (req, res) => {
  try {
    const user = await UserModel.findById({ _id: req.params.id });
    const { email, role, _id } = user;
    res.send({
      ok: true,
      user: {
        email,
        role,
        _id,
      },
    });
  } catch (error) {
    res.status(500).send({ msg: error.message, ok: false });
  }
});

module.exports = {
  userRoute,
};
