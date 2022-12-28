const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");

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

// POST /api/auth/google
exports.google = async (req, res, next) => {
  try {
    const code = req.body.code;
    const getAccessToken = await axios.post(`https://oauth2.googleapis.com/token?code=${code}&client_id=${process.env.GOOGLE_CLIENT_ID}&client_secret=${process.env.GOOGLE_CLIENT_SECRET}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&grant_type=authorization_code`, {
      headers: {
        "content-type": "application/x-www-form-urlencoded"
      }
    })
    const accessToken = getAccessToken.data.access_token;
    const { data: userProfile } = await axios.get(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`, {
      headers: {
        "authorization": `Bearer ${accessToken}`
      }
    })
    const { email, name } = userProfile;

    const exist = await User.findOne({ email });
    if (exist) {
      return await signinResponseWithToken(exist._id, res)
    }

    const nick = userProfile.name;

    const createUser = await User.create({ name, email, password: 'google', nickname: nick });
    return await signinResponseWithToken(createUser._id, res);
  } catch (error) {
    next(error);
  }
}

// POST /api/auth/naver
exports.naver = async (req, res, next) => {
  try {
    const code = req.body.code;
    const getAccessToken = await axios.post(`https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&response_type=code&client_id=${process.env.NAVER_CLIENT_ID}&client_secret=${process.env.NAVER_CLIENT_SECRET}&redirect_uri=${process.env.CORS_ORIGIN}/signin/callback/naver&code=${code}&state=1234`, {
      headers: {
        'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID ,
        'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET
      }
    })
    const accessToken = getAccessToken.data.access_token;
    const { data: userProfile} = await axios.get('https://openapi.naver.com/v1/nid/me', {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    })

    const { email, name, nickname } = userProfile.response;

    const exist = await User.findOne({ email });
    if (exist) {
      return await signinResponseWithToken(exist._id, res)
    }

    const createUser = await User.create({ name, email, password: 'google', nickname });
    return await signinResponseWithToken(createUser._id, res);
  } catch (error) {
    next(error);
  }
}

// POST /api/auth/signout
exports.signout = async (req, res, next) => {
  res.cookie('jwt', '', {
    maxAge: 0
  })
  return res.status(200).json({ message: 'success sign out' })
}

// GET /api/auth/user
exports.user = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findOne({ _id: userId }).select(["-password", "-refreshToken"]);
    res.status(200).json({ data: user })
  } catch (error) {
    next(error);
  }
}

// PUT /
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

  if (refresh && refresh === user.refreshToken) { // 리프레시 토큰 끼리 비교 해서 같으면
    const payload = jwt.verify(refresh, process.env.JWT_SECRET);

    if (payload) { // 리프레시 토큰해서 id를 찾아내
      const payload = { _id: userId };
      const accessToken = createToken(payload, "1m");
      return res.status(200).json({ data: { accessToken }});
    }
    // 로그아웃 시켜버리기
    console.log('로그아웃 시켜버리기1')
    return res.status(401).json({ message: "Not authenticated" });
  }
  // 로그아웃 시켜버리기
    console.log('로그아웃 시켜버리기2')
  return res.status(401).json({ message: "Not authenticated" });
  } catch (error) {
    next(error);
  }
}

const signinResponseWithToken = async (id, res) => {
  const payload = { _id: id };
  const accessToken = createToken(payload, "1m");
  const refreshToken = createToken(payload, "14d");

  const user = await User.findOneAndUpdate(
      { _id: id },
      { refreshToken },
      { new: true }
  ).select(["-password", "-refreshToken"]);

  res.cookie('jwt', refreshToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 * 14 // 14 day
  });

  return res.status(200).json({ data: { ...user._doc, accessToken }});
}

const createToken = (payload, expire) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: expire,
  });
}
