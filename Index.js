const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const ENV = require("./.env");
const app = express();
const connectTOdb = require("./DataBase/Connection");
connectTOdb();
app.use(express.json());
app.use(cors());
dotenv.config(ENV);
const PORT = process.env.PORT || 5000;

// Available Routes
app.use("/api/user", require("./src/routes/User"));
app.use("/api/user", require("./src/routes/Login"));
app.use("/api/user", require("./src/routes/GenerateOtp"));
app.use("/api/user", require("./src/routes/ContactUs"));

app.listen(PORT, () => {
  console.log(`Server is Running on PORT ${PORT}`);
});
