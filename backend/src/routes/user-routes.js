const express = require("express");
const User = require("../models/user.js");
const router = new express.Router();
const auth = require("../middlewares/auth.js");
router.post("/users/create", async (req, res) => {
  const { username, password } = req.body;
  const user = new User({ username, password });
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, message: "New User Created" });
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
    res.status(200).send({ user, token });
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: "Unable to login" });
  }
});

router.post("/user/logout", auth, async (req, res) => {
  try {
    console.log("starting to log out");
    req.user.tokens = req.user.tokens.filter((token) => {
        return token.token !== req.token;
    });
    console.log("searched token");

    await req.user.save();
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
