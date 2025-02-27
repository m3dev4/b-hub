// models/Like.js
import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    contentType: {
      type: String,
      enum: ["post", "comment"],
      required: true,
    },
    contentId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "contentType",
    },
    reactionType: {
      type: String,
      enum: ["like", "celebrate", "support", "interesting", "curious"],
      default: "like",
    },
  },
  { timestamps: true }
);

likeSchema.index({ user: 1, contentType: 1, contentId: 1 }, { unique: true });

const Like = mongoose.model("Like", likeSchema);

export default Like;
