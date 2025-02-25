const jwt = require("jsonwebtoken");

module.exports = async (paylaod) => {
  const token = await jwt.sign(paylaod, process.env.jwt_secret_key, {
    expiresIn: "1m",
  });
  return token;
};
