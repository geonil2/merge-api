const express = require("express");
const { likes } = require("../controllers/like");
const auth = require("../middlewares/auth");
const router = express.Router();

// 게시글 좋아요 (by. 게시글 아이디)
router.post("/:board_id", auth, likes);

module.exports = router;
