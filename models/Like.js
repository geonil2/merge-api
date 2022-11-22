const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        board: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Board',
            required: true,
        },
    },
    { timestamps: true, versionKey: false }
);


//좋아요 할 때 Board에 좋아요 유저 추가하기
likeSchema.post('save', async function() {
    const self = this;
    const ref_board = await mongoose.model('Board').findById(self.board);
    await ref_board.updateOne({$push : {likes: this.user}}).exec();
});

//좋아요 풀 때 Board에 좋아요 유저 빼기
likeSchema.pre(/Delete$/, async function(next, doc) {
    self = this._conditions._id;
    const ref_board = await mongoose.model('Board').findById(self.board);
    await ref_board.updateOne({$pull : {likes: self.user}}).exec();
})

module.exports = mongoose.model("Like", likeSchema);
