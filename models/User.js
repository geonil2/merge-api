const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        nickname: {
            type: String,
            required: true,
            unique: true,
        },
        image: {
            type: String,
            required: false,
        },
        refreshToken: {
            type: String,
            required: false,
        }
    },
    { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("User", userSchema);
