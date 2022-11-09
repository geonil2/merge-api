const Like = require("../models/Like");

exports.likes = async (req, res, next) => {
    try {
        const user = req.user._id;
        const boardId  = req.params.board_id;
        const is_liked = await Like.findOne({$and: [{ user }, { board: boardId }]});

        if (is_liked) {
            await Like.findByIdAndDelete(is_liked);
            return res.status(200).json({ data: false });
        }
        await Like.create({ user: user, board: boardId });
        return res.status(201).json({ data: true });
    } catch (error) {
        next(error);
    }
};