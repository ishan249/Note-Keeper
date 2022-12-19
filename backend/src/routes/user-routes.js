const express = require("express");
const User = require("../models/user.js");
const router = new express.Router();
const jwt = require("jsonwebtoken");
const Token = require("../models/token.js");
const {ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET} = process.env;
const auth = require("../middlewares/auth.js");
const logoutauth = require("../middlewares/logoutauth.js");
router.post("/users/create", async (req, res) => {
  const { username, password } = req.body;
  const user = new User({ username, password });
  try {
    await user.save();
    const token = await user.generateAuthToken();
    const refreshToken  = await user.createRefreshToken();
    res.status(201).json({ token, refreshToken });
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: "Error occured !! please try again" });
  }
});

router.post("/user/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.username,
      req.body.password
    );
    const token = await user.generateAuthToken();
    const refreshToken = await user.createRefreshToken();
    res.status(201).send({ token, refreshToken });
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: "Unable to login" });
  }
});

router.post("/user/generateRefreshToken", async (req,res)=>{
  try{
  const {refreshToken} = req.body;
  if(!refreshToken){
    return res.status(403).send({message:"Access denied"});
  }
  else{
    const tokenDoc = await Token.findOne({token:refreshToken});
    if(!tokenDoc){
      return res.status(401).send({ message: "Token expired!" });
    }
    else{
      const payload = jwt.verify(tokenDoc.token, REFRESH_TOKEN_SECRET);
      const token = jwt.sign({user:payload}, ACCESS_TOKEN_SECRET,{
        expiresIn:"1m",
      });
      return res.status(200).json({token});
    }
  }
  
  
}
catch(e){
  console.log("can't generate refresh token");
  console.log(e);
}
});


router.post("/user/logout", logoutauth, async (req, res) => {
  try {
    console.log("starting to log out");
    const refreshToken = req.body.token;
    await Token.findOneAndDelete({token:refreshToken});
    // req.Token.token = req.Token.token.filter((Token) => {
    //     return Token.token !== req.token;
    // }); 
    console.log("searched token");

    // await req.user.save();
    console.log("logging out");
    res.send({ message: "Logged Out" });
} catch (e) {
    res.status(500).send(e);
}
});
router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

router.delete("/users/delete", auth, async (req, res) => {
  try {
    req.user.remove();
    res.send({
      message: "Your account is deleted",
    });
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
