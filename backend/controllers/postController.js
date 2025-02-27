import Post from "../models/postModel.js";
import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import {
  validateMediaUrls,
  validateMentions,
} from "../utils/validation/validation.js"; // Assuming these utility functions exist

// Create a new post
export const createPost = asyncHandler(async (req, res) => {
  const { content, mediaUrls, postType, visibility, mentions, tags } = req.body;

  // Validate mediaUrls and mentions
  if (mediaUrls && !validateMediaUrls(mediaUrls)) {
    return res.status(400).json({ message: "Invalid media URLs" });
  }

  if (mentions && !(await validateMentions(mentions))) {
    return res.status(400).json({ message: "Invalid user IDs in mentions" });
  }

  try {
    // Create a new Post document
    const post = new Post({
      content,
      mediaUrls,
      postType,
      visibility,
      mentions,
      tags,
      author: req.user._id,
    });

    await post.save();
    return res.status(201).json(post);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error creating post" });
  }
});

// Get a post by ID
export const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postId).populate("author");

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  return res.status(200).json(post);
});

// Update a post
export const updatePost = asyncHandler(async (req, res) => {
  const { content, mediaUrls, postType, visibility, mentions, tags } = req.body;
  const post = await Post.findById(req.params.postId);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  if (post.author.toString() !== req.user._id.toString()) {
    return res
      .status(403)
      .json({ message: "Not authorized to update this post" });
  }

  // Validate mediaUrls and mentions
  if (mediaUrls && !validateMediaUrls(mediaUrls)) {
    return res.status(400).json({ message: "Invalid media URLs" });
  }

  if (mentions && !(await validateMentions(mentions))) {
    return res.status(400).json({ message: "Invalid user IDs in mentions" });
  }

  try {
    // Update the post
    post.content = content;
    post.mediaUrls = mediaUrls;
    post.postType = postType;
    post.visibility = visibility;
    post.mentions = mentions;
    post.tags = tags;
    post.isEdited = true;

    await post.save();
    return res.status(200).json({
      message: "Post updated successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error updating post" });
  }
});

// Delete a post
export const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postId);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  if (post.author.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    return res
      .status(403)
      .json({ message: "Not authorized to delete this post" });
  }

  await post.deleteOne();
  return res.status(204).json({
    message: "Post deleted successfully",
    success: true,
  });
});

// Get all posts
export const getAllPosts = asyncHandler(async (req, res) => {
  const {
    authorId,
    postType,
    visibility,
    sortBy = "createdAt",
    sortOrder = "asc",
    page = 1,
    limit = 10,
  } = req.query;

  const query = {};
  if (authorId) query.author = authorId;
  if (postType) query.postType = postType;
  if (visibility) query.visibility = visibility;

  const posts = await Post.find(query)
    .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const totalPosts = await Post.countDocuments(query);
  res.set("X-Total-Count", totalPosts);
  return res.status(200).json(posts);
});
