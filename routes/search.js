const express = require("express");
const { search } = require("../controllers/search");
const router = express.Router();

// 게시글 검색 (by. 키워드)
router.get("/", search);

module.exports = router;
