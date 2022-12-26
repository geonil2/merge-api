const express = require("express");
const { signup, signin, user, updateUserName, refresh } = require("../controllers/auth");
const {auth, refreshAuth} = require("../middlewares/auth");
const router = express.Router();

// 회원가입 (이름, 이메일, 비밀번호)
router.post("/signup", signup, signin);

// 로그인 (이메일, 비밀번호)
router.post("/signin", signin);

// 유저정보
router.post("/user", auth, user);

// 유정정보변경 (닉네임)
router.put("/", auth, updateUserName);

// 토큰 갱신
router.get("/refresh", refreshAuth, refresh);

module.exports = router;
