const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["question", "info", "community", "recruit", "notice"],
      required: true,
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
  },
  { timestamps: true, versionKey: false }
);

boardSchema.virtual("comment", {
    ref: "Comment",
    localField: "_id",
    foreignField: "board",
    count: true
})

boardSchema.set('toObject', {
    virtuals: true,
    versionKey:false,
    transform: function (doc, ret) {
        delete ret.id;
    }
});
boardSchema.set('toJSON', {
    virtuals: true,
    versionKey:false,
    transform: function (doc, ret) {
        delete ret.id;
    }
});

module.exports = mongoose.model("Board", boardSchema);
