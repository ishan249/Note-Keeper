const jwt = require("jsonwebtoken");
const User = require("../models/user");
const privateKey = process.env.ACCESS_TOKEN_SECRET;

require("dotenv").config();
const auth = async (req, res, next) => {
  try {

    const token = req.header("Authorization").replace("Bearer ", "");
   

    const decoded = jwt.verify(token, privateKey);
    


    const user = await User.findOne({
      _id: decoded._id,
      // "tokens.token": token,
    });


    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    console.log("reached at auth.js file error");
    console.log(e);
    res.status(401).send({ Error: "Unauthenticated" });
  }
};

module.exports = auth;
