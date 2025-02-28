import express from "express";
import { isAuthenticate } from "../middlewares/auth.middleware.js";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPostById,
  updatePost,
} from "../controllers/postController.js";
import {
  createComment,
  deleteComment,
  getCommentById,
  getCommentsByPost,
  updateComment,
} from "../controllers/commentController.js";
import {
  getLikesByContent,
  likeContent,
  unlikeContent,
} from "../controllers/likeController.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post("/post-create", isAuthenticate, upload.array('media', 5), createPost);
router.get("/:postId", isAuthenticate, getPostById);
router.put("/post-update/:postId", isAuthenticate, updatePost);
router.delete("/post-delete/:postId", isAuthenticate, deletePost);
router.get("/", isAuthenticate, getAllPosts);

//// -------------- Comment Post Route ---------------

router.post("/:postId/comment", isAuthenticate, createComment);
router.get("/:postId/comments", isAuthenticate, getCommentsByPost);
router.get("/comments/:commentId", isAuthenticate, getCommentById);
router.put("/comments/:commentId", isAuthenticate, updateComment);
router.delete("/comments/:commentId", isAuthenticate, deleteComment);

//// -------------- like Post Route ---------------
router.post("/like", isAuthenticate, likeContent);
router.delete("/unlike/:likeId", isAuthenticate, unlikeContent);
router.get("/get-likes-by-content", isAuthenticate, getLikesByContent);

export default router;
