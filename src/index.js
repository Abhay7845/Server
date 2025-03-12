const DatabaseConnection = require("./dataBase/Connection");
require('dotenv').config();
const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 7000;

// Available Routes
app.use("/api/user", require("./routes/User"));
app.use("/api/user", require("./routes/Login"));
app.use("/api/user", require("./routes/GenerateOtp"));
app.use("/api/user", require("./routes/ContactUs"));

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
DatabaseConnection(process.env.DB_URL);

