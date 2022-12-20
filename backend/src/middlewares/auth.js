const jwt = require("jsonwebtoken");
const User = require("../models/user");
const privateKey = process.env.ACCESS_TOKEN_SECRET;

require("dotenv").config();
const auth = async (req, res, next) => {
  try {
    console.log("reach 0");
    const token = req.header("Authorization").replace("Bearer ", "");
    console.log("reach 1");

    const decoded = jwt.verify(token, privateKey);
    console.log("reach 2");

    const user = await User.findOne({
      _id: decoded._id,
      // "tokens.token": token,
    });
    console.log("reach 3");

    if (!user) {
      throw new Error();
    }
    console.log("reach 4");

    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    if (e.name === "TokenExpiredError") {
      console.log("reached at this token auth.js file error");
      return res
        .status(401)
        .json({ error: "Session timed out,please login again" });
    }
    else if (e.name === "JsonWebTokenError") {
        return res
          .status(401)
          .json({ error: "Invalid token,please login again!" });
      } else {
        //catch other unprecedented errors
        console.error(e);
        return res.status(400).json({ e });
      }
    // res.status(401).send({ Error: "Unauthenticated" });
  }
};

module.exports = auth;
