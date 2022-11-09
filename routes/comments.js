const express = require("express");
const {
  createComment,
  getCommentsByBoardId,
  updateComment,
  deleteComment,
} = require("../controllers/comments");
const auth = require("../middlewares/auth");
const router = express.Router();

// 댓글 생성
router.post("/:board_id", auth, createComment);

// 댓글 조회 (by. 게시글 아이디)
router.get("/:board_id", getCommentsByBoardId);

// 댓글 수정 (by. 게시글 아이디 && 댓글 아이디)
router.put("/:board_id/:reple_id", auth, updateComment);

// 댓글 삭제 (by. 게시글 아이디 && 댓글 아이디)
router.delete("/:board_id/:reple_id", auth, deleteComment);

module.exports = router;
