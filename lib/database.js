const mongoose = require("mongoose");
console.log(process.env.NODE_ENV)
mongoose.connect(process.env.MONGODB_URI);

module.exports = mongoose.connection;
