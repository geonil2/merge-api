const {isValidObjectId} = require("mongoose");
const Like = require("../models/Like");
const {getUserId} = require("../middlewares/auth");
const Board = require("../models/Board");

// GET /api/search?p={}&offset={}&limit={}
exports.search = async (req, res, next) => {
    try {
        const keyword = req.query.p
        const offset = req.query.offset || process.env.DEFAULT_OFFSET;
        const limit = req.query.limit || process.env.DEFAULT_LIMIT;

        if (!keyword) {
            res.status(400);
            throw new Error("Invalid category");
        }

        const totalCount = await Board.find({
           $or:[
               {title:{ $regex: keyword, $options: '$i'}},
               {description:{ $regex: keyword, $options: '$i'}},
           ]
        }).count()
        const search = await Board.find({
            $or:[
                {title:{ $regex: keyword, $options: '$i'}},
                {description:{ $regex: keyword, $options: '$i'}},
            ]
        }).limit(parseInt(limit)).skip(parseInt(offset)).populate('owner', '-accessToken').sort({"updatedAt": -1})

        const [total, searchList] = await Promise.all([
            totalCount,
            search,
        ]);

        return res.status(200).json({ data : { total, list: searchList } })
    } catch (error) {
        next(error);
    }
};