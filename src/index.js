const express = require("express");
const cors = require("cors");
require('dotenv').config();
const app = express();
// const connectTOdb = require("./dataBase/Connection");
// connectTOdb(process.env.DB_URL);
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 7000;

// Available Routes
app.use("/api/user", require("./routes/User"));
app.use("/api/user", require("./routes/Login"));
app.use("/api/user", require("./routes/GenerateOtp"));
app.use("/api/user", require("./routes/ContactUs"));

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
