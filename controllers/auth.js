const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// POST /api/auth/signup
exports.signup = async (req, res, next) => {
  try {
    const { name, email, password, nickname } = req.body;

    const exist = await User.findOne({ email });
    if (exist) {
      res.status(400);
      throw new Error("User already exist");
    }

    const nick = nickname ? nickname : name;
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
    const hash = await bcrypt.hash(password, salt);

    await User.create({ name, email, password: hash, nickname: nick });

    next();
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/signin
exports.signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const exist = await User.findOne({ email });
    if (!exist) {
      res.status(400);
      throw new Error("Invalid user credentials");
    }

    const compare = await bcrypt.compare(password, exist.password);
    if (!compare) {
      res.status(400);
      throw new Error("Invalid user credentials");
    }

    const payload = { _id: exist._id };
    const accessToken = createToken(payload, "1m");
    const refreshToken = createToken(payload, "14d");

    const user = await User.findOneAndUpdate(
        { _id: exist._doc._id },
        { refreshToken },
        { new: true }
    ).select(["-password", "-refreshToken"]);

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 * 14 // 14 day
    });

    return res.status(200).json({ data: { ...user._doc, accessToken }});
  } catch (error) {
    next(error);
  }
};

exports.user = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findOne({ _id: userId });
    res.status(200).json({ data: user })
  } catch (error) {
    next(error);
  }
}

exports.updateUserName = async (req, res, next) => {
  try {
    const { nickname } = req.body;
    const userId = req.user._id;
    console.log(userId, 'userId')
    const exist = await User.findOne({ nickname });
    if (exist) {
      res.status(400);
      throw new Error("nickname already exist");
    }

    const user = await User.findOneAndUpdate(
        { _id: userId },
        { nickname },
        { new: true }
    )
    if (!user) {
      res.status(400);
      throw new Error("User not found");
    }

    return res.status(200).json({ message: "Updated successfully" })
  } catch (error) {
    next(error);
  }
}

exports.refresh = async (req, res, next) => {
  try {
  const refresh = req.cookies['jwt'];
  const userId = req.user._id;
  const user = await User.findOne({ _id: userId });

  if (refresh && refresh === user.refreshToken) { // 리프레시 토큰 끼리 비교 해서
    const payload = jwt.verify(refresh, process.env.JWT_SECRET);

    if (payload) {
      const payload = { _id: userId };
      const accessToken = createToken(payload, "1m");
      return res.status(200).json({ data: { accessToken }});
    }
    // 로그아웃 시켜버리기
    return res.status(401).json({ message: "Not authenticated" });
  }
  // 로그아웃 시켜버리기
  return res.status(401).json({ message: "Not authenticated" });
  } catch (error) {
    next(error);
  }
}

const createToken = (payload, expire) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: expire,
  });
}
