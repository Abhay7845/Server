/** @format */

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const ENV = require("../.env");
mongoose.set("strictQuery", false);

const DataBaseConnectionURI = "mongodb://127.0.0.1:27017/StudentsData";

dotenv.config(ENV);
// const DataBaseConnectionURI = process.env.DATABASE_URL;

const DatabaseConnection = () => {
  mongoose
    .connect(DataBaseConnectionURI, {
      useNewUrlParser: true,
      useUniFiedTopology: true,
    })
    .then(() => console.log("Connection Successfully"))
    .catch((error) => console.log("error==>", error));
};

module.exports = DatabaseConnection;
