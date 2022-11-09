const express = require("express");
const { signup, login } = require("../controllers/auth");
const auth = require("../middlewares/auth");
const router = express.Router();

// 회원가입 (이름, 이메일, 비밀번호)
router.post("/signup", signup);

// 로그인 (이메일, 비밀번호)
router.post("/login", auth, login);

module.exports = router;
