const jwt = require("jsonwebtoken");
const User = require("../models/user");

require("dotenv").config();
const logoutauth = async (req, res, next) => {
  try {
    const refreshToken = req.header("Authorization").replace("Bearer ", "");

    const anotherDecoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findOne({
      _id: anotherDecoded._id,
      //   "tokens.token": token,
    });

    if (!user) {
      throw new Error();
    }

    const body = {
      token: refreshToken,
      user: user,
    };

    next();
    return body;
  } catch (e) {
    if (e.name === "TokenExpiredError") {
      console.log("reached at token auth.js file error");
      return res
        .status(401)
        .json({ error: "Session timed out,please login again" });
    }
  }
};

module.exports = logoutauth;
