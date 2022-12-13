

const mongoose = require("mongoose");

const dbUrl = process.env.NOTES_DBURL;

mongoose.connect(dbUrl, {
  useNewUrlParser:true,
  useUnifiedTopology:true,
})

