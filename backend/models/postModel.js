import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxLength: 5000,
    },
    mediaUrls: [
      {
        type: String,
        validate: function (url) {
          return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(
            url
          );
        },
        message: "URL invalide",
      },
    ],
    postType: {
      type: String,
      enum: ["post", "update", "article", "video", "event", "image", "link", "general"],
      default: "general",
    },
    visibility: {
      type: String,
      enum: ["public", "private", "followers"],
      default: "public",
    },
    mentions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    tags: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],
    likes: {
      type: Number,
      default: 0,
    },
    shares: {
      type: Number,
      default: 0,
    },
    comments: {
      type: Number,
      default: 0,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Indexation pour les recherches
postSchema.index({ content: "text", tags: "text" });

// Index pour l'affichage chronologique efficace
postSchema.index({ createdAt: -1 });

// Index pour filtrer par visibilité et type
postSchema.index({ visibility: 1, type: 1 });

const Post = mongoose.model("Post", postSchema);

export default Post;
