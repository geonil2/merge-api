const User = require("../models/User");
const Board = require("../models/Board");
const Comment = require("../models/Comment");
const { isValidObjectId } = require("mongoose");

// POST /api/comments/:board_id
exports.createComment = async (req, res, next) => {
  try {
    const { contents } = req.body;
    const owner = req.user._id;
    const boardId = req.params.board_id;

    if (!isValidObjectId(boardId)) {
      res.status(400);
      throw new Error("Invalid ObjectId");
    }

    const comment = await Comment.create({
      owner,
      board: boardId,
      contents,
    });

    return res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
};

// GET /api/comments/:board_id
exports.getCommentsByBoardId = async (req, res, next) => {
  try {
    const board = req.params.board_id;

    if (!isValidObjectId(board)) {
      res.status(400);
      throw new Error("Invalid ObjectId");
    }

    const comments = await Comment.find({ board })
        .populate("owner", ["-accessToken"])
        .select("-board")
        .sort({ "updatedAt": -1 });
    return res.status(200).json({ data: comments });
  } catch (error) {
    next(error);
  }
};

// PUT /api/comments/:board_id/:reple_id
exports.updateComment = async (req, res, next) => {
  try {
    const boardId = req.params.board_id;
    const commentId = req.params.reple_id;

    if (!isValidObjectId(boardId) || !isValidObjectId(commentId)) {
      res.status(400);
      throw new Error("Invalid ObjectId");
    }

    const comment = await Comment.findById(commentId);
    const user = req.user._id;

    if (user !== comment.owner.toString()) {
      res.status(403);
      throw new Error("Access denied");
    }

    const { contents } = req.body;
    const updated = await Comment.findOneAndUpdate(
      {
        _id: commentId,
        board: boardId,
      },
      {
        contents,
      },
      { new: true }
    );

    return res.status(200).json({ data : updated });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/comments/:board_id/:reple_id
exports.deleteComment = async (req, res, next) => {
  try {
    const boardId = req.params.board_id;
    const commentId = req.params.reple_id;

    if (!isValidObjectId(boardId) || !isValidObjectId(commentId)) {
      res.status(400);
      throw new Error("Invalid ObjectId");
    }

    const comment = await Comment.findById(commentId);
    const user = req.user._id;

    if (user !== comment.owner.toString()) {
      res.status(403);
      throw new Error("Access denied");
    }

    await comment.remove();

    return res.status(200).json({ message: "Delete successfully" });
  } catch (error) {
    next(error);
  }
};
