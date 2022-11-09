const express = require("express");
const {
  createBoard,
  uploadBoardImage,
  getBoardsByCategory,
  getBoardById,
  getBestBoard,
  getCountByCategory,
  updateBoardById,
  deleteBoardById,
} = require("../controllers/boards");
const auth = require("../middlewares/auth");
const upload = require('../middlewares/multer');
const router = express.Router();

// 게시글 생성
router.post("/", auth, createBoard);

router.post("/upload/image", auth, upload.single('boardImage'), uploadBoardImage)

// 게시글 리스트 조회 (by. 카테고리 명)
router.get("/", getBoardsByCategory);

// 게시글 상세 조회 (by. 게시글 아이디)
router.get("/:board_id", getBoardById);

// 인기 게시글 리스트 조회
router.get("/all/best", getBestBoard);

// 전체 게시글 수 조회 (by. 카테고리)
router.get("/:category/count", getCountByCategory);

// 게시글 수정 (by. 게시글 아이디)
router.put("/:board_id", auth, updateBoardById);

// 게시글 삭제 (by. 게시글 아이디)
router.delete("/:board_id", auth, deleteBoardById);


module.exports = router;
