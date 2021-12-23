/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import favicon from "serve-favicon";
import httpError from "http-errors";
import passport from "passport";
import cookieParser from "cookie-parser";

import cors from "cors";
import morgan from "morgan";
import logger from "./logger/winston.js";

import callPassport from "./passport/index.js";
import postRouter from "./routes/posts.js";
import locationRouter from "./routes/locations.js";
import authRouter from "./routes/auth.js";
import usersRouter from "./routes/users.js";

// to test
import mockLogin from "./utils/mock-login.js";

const app = express();
const port = process.env.PORT || 3000;

// log
const combined =
  ":remote-addr - :remote-user ':method :url HTTP/:http-version' :status :res[content-length] ':referrer' ':user-agent'";
const morganFormat = process.env.NODE_ENV !== "production" ? "dev" : combined;
app.use(morgan(morganFormat, { stream: logger.stream }));

dotenv.config();
callPassport();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// mongo DB & mongoose
const mongoUri = process.env.MONGO_DB_URI;
mongoose.connect(mongoUri);

// parsers, session, and favicon
const __dirname = path.resolve();
app.use(express.static(`${__dirname}/public`));
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(cookieParser());

app.use(passport.initialize());

// to test
if (process.env.NODE_ENV === "test") {
  app.use(mockLogin);
}

// routes
app.use("/api/locations", locationRouter);
app.use("/api/posts", postRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);

// server listen
if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    logger.info(`Server Start Listening at ${port}`);
  });
}

// Error handler
// 404 error
app.use((req, res, next) => {
  next(httpError(404).message);
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  logger.error(err);
  res.status(500).json({ error: true, message: err });
});

export default app;
