const jwt = require("jsonwebtoken");

const secretKey = process.env.TOKEN_SECRET || "secret-password";

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1]; //posle bearer

  try {
    const decoded = jwt.verify(token, secretKey);
    // console.log("Decoded token user:", decoded);
    req.user = decoded; //ubacuje usera
    next();
  } catch (error) {
    console.log("Token error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
module.exports = verifyToken;
