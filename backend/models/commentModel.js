// models/Comment.js
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      maxLength: 500,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    mentions: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
    likes: {
      type: Number,
      default: 0,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index pour récupérer tous les commentaires d'un post
commentSchema.index({ post: 1, createdAt: -1 });
// Index pour les réponses à un commentaire
commentSchema.index({ parentComment: 1 });

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
