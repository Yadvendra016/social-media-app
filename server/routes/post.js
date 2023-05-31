import express from "express";
import formidable from "express-formidable";
// middleware
import { requireSignIn, canEditDeletePost } from "../middlewares";
import {
  createPost,
  uploadImage,
  postByUser,
  userPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
} from "./../controllers/post";

const router = express.Router();

router.post("/create-post", requireSignIn, createPost);
router.post(
  "/upload-image",
  requireSignIn,
  formidable({ maxFileSize: 5 * 1024 * 1024 }),
  uploadImage
);
//posts-rendring
router.get("/user-posts", requireSignIn, postByUser);
router.get("/user-post/:_id", requireSignIn, userPost); // edit post
//update post
router.put("/update-post/:_id", requireSignIn, canEditDeletePost, updatePost);
//delete post
router.delete(
  "/delete-post/:_id",
  requireSignIn,
  canEditDeletePost,
  deletePost
);
//like and unlike post
router.put("/like-post", requireSignIn, likePost);
router.put("/unlike-post", requireSignIn, unlikePost);

module.exports = router; // each file in node.js treated as module
