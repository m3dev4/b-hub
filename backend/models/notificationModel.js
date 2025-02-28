import mongoose from "mongoose";

const notifySchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["like", "comment", "follow", "mention", "message"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  relatedPost: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Notification = mongoose.model("Notification", notifySchema);

export default Notification;
