const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/user.model");
const { error } = require("winston");
require("dotenv").config();
const authMiddleWare = async (req, res, next) => {
  const accessToken = req.headers.authorization;

  if (!accessToken) {
    return res.status(401).json({ message: "Access token not provided" });
  }

  try {
    // decode access token to get user information

    const decodedToken = jwt.verify(accessToken, process.env.secret);

    if (decodedToken) {
      console.log("Decoded Token:", decodedToken);
      req.body.role = decodedToken.role;
      next();
    } else {
      res.status(400).send({ msg: "Please Login" });
    }
  } catch (error) {
    res.status(401).send(error);
    console.log(error.message);
  }
};
module.exports = { authMiddleWare };
