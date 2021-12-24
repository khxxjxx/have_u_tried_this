/* eslint-disable import/extensions */
import { Router } from "express";
import { asyncHandler } from "../../utils/index.js";
import {
  getPostByUserId,
  getCommentsByUserId,
  getUserBookmarks,
} from "../../services/users.service.js";
import loginRequired from "../../middlewares/login-required.js";

const router = Router();

function isValidUser(userId, _id) {
  return userId === _id.toString();
}

export default (app) => {
  app.use("/users", router);

  // 내 게시글 목록
  router.get(
    "/:userId/posts",
    loginRequired,
    asyncHandler(async (req, res) => {
      const { userId } = req.params;
      const { _id } = req.user;

      if (!isValidUser(userId, _id)) {
        throw new Error("권한이 없습니다.");
      }

      const myPosts = await getPostByUserId(userId);

      res.json(myPosts);
    }),
  );

  router.get(
    "/:userId/comments",
    loginRequired,
    asyncHandler(async (req, res) => {
      const { userId } = req.params;
      const { _id } = req.user;

      if (!isValidUser(userId, _id)) {
        throw new Error("권한이 없습니다.");
      }

      const comments = await getCommentsByUserId(userId);
      res.json(comments);
    }),
  );

  router.get(
    "/:userId/likes",
    loginRequired,
    asyncHandler(async (req, res) => {
      const { userId } = req.params;
      const { _id } = req.user;

      if (!isValidUser(userId, _id)) {
        throw new Error("권한이 없습니다.");
      }

      const bookmarks = await getUserBookmarks(userId);
      res.status(200).json(bookmarks);
    }),
  );
};
