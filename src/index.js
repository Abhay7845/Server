const express = require("express");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
require("dotenv").config();
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 8000;

//DATA BASE CONNECTION CODD
const DatabaseConnection = (connectionURI) => {
  mongoose
    .connect(connectionURI, {
      useNewUrlParser: true,
      useUniFiedTopology: true,
    })
    .then(() => console.log("DataBase Connected Successfully"))
    .catch((error) => console.log("error==>", error));
};
DatabaseConnection(process.env.DB_URL);

// Available Routes
app.use("/api/user", require("./routes/User"));
app.use("/api/user", require("./routes/Login"));
app.use("/api/user", require("./routes/GenerateOtp"));
app.use("/api/user", require("./routes/ContactUs"));

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
