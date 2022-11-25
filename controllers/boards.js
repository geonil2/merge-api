const Board = require("../models/Board");
const { isValidObjectId } = require("mongoose");

// POST /api/boards
exports.createBoard = async (req, res, next) => {
  try {
    const { title, description, category } = req.body;
    const owner = req.user._id;

    const board = await Board.create({
      owner,
      title,
      description,
      category,
    });

    return res.status(201).json({ data: board });
  } catch (error) {
    next(error);
  }
};

// POST /api/boards/upload/image
exports.uploadBoardImage = async (req, res, next) => {
  try {
    const uri =  process.env.NODE_ENV === 'production' ? req.file.location : `http://localhost:${process.env.PORT}/${req.file.path}`;
    return res.status(201).json({ data: uri });
  } catch (error) {
    next(error);
  }
};

// GET /api/boards?category={}&offset={}&limit={}
exports.getBoardsByCategory = async (req, res, next) => {
  try {
    const categories = ["question", "info", "community", "recruit", "notice"];

    const category = req.query.category;
    const offset = req.query.offset || process.env.DEFAULT_OFFSET;
    const limit = req.query.limit || process.env.DEFAULT_LIMIT;

    if (!categories.includes(category)) {
      res.status(400);
      throw new Error("Invalid category");
    }

    const totalCount = await Board.find({ category }).count()
    const boardsListByCategory = await Board.find({ category })
        .limit(parseInt(limit))
        .skip(parseInt(offset))
        .populate('owner', '-accessToken')
        .sort({"updatedAt": -1})
    const [total, boards] = await Promise.all([
      totalCount,
      boardsListByCategory,
    ]);

    return res.status(200).json({ data : { total, list: boards }});
  } catch (error) {
    next(error);
  }
};

// GET /api/boards/:board_id
exports.getBoardById = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.board_id)) {
      res.status(400);
      throw new Error("Invalid ObjectId");
    }

    const board = await Board.findById(req.params.board_id).populate("owner", [
      "-accessToken",
      "-__v",
    ]);

    if (!board) {
      res.status(404);
      throw new Error("Board not found");
    }

    res.status(200).json({ data: board });
  } catch (error) {
    next(error);
  }
};

// GET /api/all/best
exports.getBestBoard = async (req, res, next) => {
  try {
    const bestBoardList = await Board.find()
        .populate("comment")
        .select("-owner")
        .sort({"likes": -1})
        .limit(10);

    return res.status(200).json({ data : bestBoardList})
  } catch (error) {
    next(error);
  }
};

// GET /api/boards/count?category={}
exports.getCountByCategory = async (req, res, next) => {
  try {
    const categories = ["question", "info", "community", "recruit", "notice"];
    const category = req.params.category;

    if (!categories.includes(category)) {
      res.status(400);
      throw new Error("Invalid category");
    }

    const count = await Board.find({ category }).count();

    return res.status(200).json({data : count});
  } catch (error) {
    next(error);
  }
};

// PUT /api/boards/:board_id
exports.updateBoardById = async (req, res, next) => {
  try {
    const owner = req.user._id;
    const boardId = req.params.board_id;

    if (!isValidObjectId(boardId)) {
      res.status(400);
      throw new Error("Invalid ObjectId");
    }

    const { title, description } = req.body;

    const board = await Board.findById(boardId);

    if (!board) {
      res.status(404);
      throw new Error("Board not found");
    }

    if (owner !== board.owner.toString()) {
      res.status(403);
      throw new Error("Access denied");
    }

    const updated = await Board.findOneAndUpdate(
      { _id: boardId },
      {
        title,
        description,
      },
      { new: true }
    );

    return res.status(200).json({ data: updated });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/boards/:board_id
exports.deleteBoardById = async (req, res, next) => {
  try {
    const owner = req.user._id;
    const boardId = req.params.board_id;

    if (!isValidObjectId(boardId)) {
      res.status(400);
      throw new Error("Invalid ObjectId");
    }

    const board = await Board.findById(boardId);

    if (!board) {
      res.status(404);
      throw new Error("Board not found");
    }

    if (owner !== board.owner.toString()) {
      res.status(403);
      throw new Error("Access denied");
    }

    await Board.findByIdAndRemove(boardId);

    return res.status(200).json({ message: "Delete successfully" });
  } catch (error) {
    next(error);
  }
};
