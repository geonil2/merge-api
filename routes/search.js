const express = require("express");
const { search } = require("../controllers/search");
const router = express.Router();

// 게시글 좋아요 (by. 게시글 아이디)
router.get("/", search);

module.exports = router;
