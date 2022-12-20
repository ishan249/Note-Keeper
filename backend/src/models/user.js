const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Note= require("./notes.js");
const Token = require("./token.js");
const {ACCESS_TOKEN_SECRET,REFRESH_TOKEN_SECRET } = process.env;
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, "Name is required"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
      minlength: 8,
    },
    // tokens: [
    //   {
    //     token: {
    //       type: String,
    //       required: true,
    //     },
    //   },
    // ],
  },
  {
    timestamps: true,
  }
);

userSchema.virtual("notes", {
  ref: "Note",
  localField: "_id",
  foreignField: "owner",
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  return userObject;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign(
    {
      _id: user.id.toString(),
    },
    ACCESS_TOKEN_SECRET,{
      expiresIn:"10m",
    }
  );

  // user.tokens = user.tokens.concat({ token });
  // await user.save();
  return token;
};


userSchema.methods.createRefreshToken = async function (){
  const user = this;
  const refreshToken = jwt.sign(
    {

      _id: user.id.toString(),
    },
    REFRESH_TOKEN_SECRET, {
      expiresIn:"2d",
    }
  );
  await new Token({token:refreshToken}).save();
  return refreshToken;
}

userSchema.statics.findByCredentials = async (username, password) => {
  const user = await User.findOne({ username });

  if (!user) {
    throw new Error("Unable to Login");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Unable to Login");
  }

  return user;
};

userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

userSchema.pre("remove", async function (next) {
  const user = this;
  await Note.deleteMany({ owner: user._id });
  next();
});
const User = mongoose.model("User", userSchema);
module.exports = User;
