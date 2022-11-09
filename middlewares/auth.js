const jwt = require("jsonwebtoken");
const axios = require("axios");
const User = require("../models/User");

module.exports = (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization;

    if (
      bearerToken &&
      bearerToken.startsWith("Bearer") &&
      bearerToken.split(" ").length === 2
    ) {
      const accessToken = bearerToken.substring(7);
      const payload = jwt.verify(accessToken, process.env.JWT_SECRET);

      req.user = payload;
      next();
    } else {
      return res.status(401).json({ message: "Not authenticated" });
    }
  } catch (error) {
    res.status(401);
    next(error);
  }
};
