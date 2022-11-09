require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connection = require("./lib/database");
const { notFound, errorHandler } = require("./middlewares/error");

// Express Server
const app = express();

// NODE Environment
const NODE_ENV = process.env.NODE_ENV;

// Server Port
const PORT = process.env.PORT;

// Express Middlewares
app.use(cors({ origin: process.env.CORS_ORIGIN }));
// app.use(helmet());
app.use(helmet({ crossOriginResourcePolicy: { policy: 'same-site' } }));
app.use(morgan(NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "5mb" }));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/boards", require("./routes/boards")); // 게시글
app.use("/api/comments", require("./routes/comments")); // 댓글
app.use("/api/likes", require("./routes/like")); // 좋아요
app.use("/api/search", require("./routes/search")) // 검색
app.use('/images', express.static('images')); // 이미지 가져오기

// Error Middlewares
app.use(notFound);
app.use(errorHandler);

// Connection Success -> `Run Server`
connection.on("connected", () => {
  console.log(`mongodb connected - ${connection.host}`);

  app.listen(PORT, () => {
    console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
  });
});

// Connection Fail -> `System OFF`
connection.on("error", (error) => {
  console.error(`mongodb error - ${error}`);
  process.exit(1);
});
