const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

// const connectionURI = "mongodb+srv://softwaredeveloper638:softwareDeveloper638@collagedata.vagk1j8.mongodb.net/";

const DatabaseConnection = (connectionURI) => {
  mongoose.connect(connectionURI, {
    useNewUrlParser: true,
    useUniFiedTopology: true,
  }).then(() => console.log("DataBase Connected Successfully")).catch((error) => console.log("error==>", error));
};

module.exports = DatabaseConnection;
