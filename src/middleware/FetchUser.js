var jwt = require("jsonwebtoken");
const JWT_SECRET = "AryanIsGoodBoy";

const fetchUser = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(200).send({ code: 1001, massage: "Access token is required" });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.body.user = data.user;
    next();
  } catch (error) {
    return res.status(401).send({ code: 401, error: "Invalid Token" });
  }
};

module.exports = fetchUser;
