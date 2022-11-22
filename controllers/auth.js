const User = require("../models/User");
const bcrypt = require("bcryptjs");

// POST /api/auth/signup
exports.signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const exist = await User.findOne({ email });
    if (exist) {
      res.status(400);
      throw new Error("User already exist");
    }

    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
    const hash = await bcrypt.hash(password, salt);

    await User.create({ name, email, password: hash });

    return res.status(201).json({ message: "Register successfully" });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, name, image } = req.body;
    const accessToken = req.accessToken;

    const user = await User.findOneAndUpdate(
        { email },
        { accessToken },
        { new: true }
    );

    if (!user) {
      const newUser = await User.create({ name, email, image, accessToken });
      return res.status(201).json({ data: newUser });
    }

    return res.status(200).json({ data: user });
  } catch (error) {
    next(error);
  }
};
