const express = require("express");
const { signup, signin, google, naver, signout, user, updateUserName, refresh } = require("../controllers/auth");
const {auth, refreshAuth} = require("../middlewares/auth");
const router = express.Router();

// 회원가입 (이름, 이메일, 비밀번호)
router.post("/signup", signup, signin);

// 로그인 (이메일, 비밀번호)
router.post("/signin", signin);

// 로그인 구글(code)
router.post('/google', google)


// 로그인 네이버(code)
router.post('/naver', naver)

// 로그아웃
router.post("/signout", auth, signout);

// 유저정보
router.get("/user", auth, user);

// 토큰 갱신
router.get("/refresh", refreshAuth, refresh);

// 유정정보변경 (닉네임)
router.put("/", auth, updateUserName);

module.exports = router;
