const mongoose = require("mongoose");
require("dotenv").config();

const connect = () => {
  const name = process.env.Mongo_name;
  const pw = process.env.Mongo_pw;
  const collection = process.env.Mongo_collection;

  mongoose
    .connect(`mongodb+srv://${name}:${pw}@${collection}.5agxbtx.mongodb.net/blog?retryWrites=true&w=majority`)
    .catch(err => console.log(err));
};

mongoose.connection.on("error", err => {
  console.error("몽고디비 연결 에러", err);
});

module.exports = connect;