var jwt = require("jsonwebtoken");
const JWT_SECRET = "AryanIsGoodBoy";

const fetchUser = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(404).send({ error: "invalid token" });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.body.user = data.user;
    next();
  } catch (error) {
    // console.log("error==>", error);
    return res.status(401).send({ error: "user not found" });
  }
};

module.exports = fetchUser;
