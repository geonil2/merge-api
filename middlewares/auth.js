const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
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

exports.refreshAuth = (req, res, next) => {
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
      return res.status(400).send({ message: 'Access token is not expired!' }) // 만료 안됬어
    } else {
      return res.status(401).json({ message: "Not authenticated" });
    }
  } catch (error) {
    const bearerToken = req.headers.authorization;
    const accessToken = bearerToken.substring(7);
    if (error.message === 'jwt expired') {
      const decoded = jwt.decode(accessToken); // 엑세스 디코딩해서
      if(!decoded) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      req.user = decoded;
      next();
    } else {
      res.status(401);
      next(error);
    }
  }
};

