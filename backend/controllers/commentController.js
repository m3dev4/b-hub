import Comment from '../models/commentModel.js';
import Post from '../models/postModel.js';
import asyncHandler from '../middlewares/asyncHandler.middleware.js';

// Create a new comment
export const createComment = asyncHandler(async (req, res) => {
    const { content, parentComment, mentions } = req.body;
    const { postId } = req.params;
    console.log("postid",postId);

    // Validate postId
    const post = await Post.findById(postId);
    if (!post) {
        return res.status(404).json({ message: 'Post not found' });
        

    }

    // Validate parentComment if provided
    if (parentComment) {
        const parent = await Comment.findById(parentComment);
        if (!parent) {
            return res.status(404).json({ message: 'Parent comment not found' });
        }
    }
    try {
        
    // Create a new Comment document
    const comment = new Comment({
        content,
        post: postId,
        author: req.user._id,
        parentComment: parentComment || null,
        mentions
    });

    await comment.save();
    post.comments += 1; // Increment comment count on the post
    await post.save();

    return res.status(201).json({
        message: 'Comment created successfully',
        comment,
        success: true
    });
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to create comment',
            error: error.message,
            success: false
        })
    }
});

// Get all comments by post
export const getCommentsByPost = asyncHandler(async (req, res) => {
    const { postId } = req.params;

    // Validate postId
    const post = await Post.findById(postId);
    if (!post) {
        return res.status(404).json({ message: 'Post not found' });
    }

    const { page = 1, limit = 10 } = req.query;
    const comments = await Comment.find({ postId })
        .populate('author', 'username profilePicture') // Populate author field
        .sort({ createdAt: -1 }) // Sort by createdAt descending
        .skip((page - 1) * limit)
        .limit(limit);

    const totalComments = await Comment.countDocuments({ postId });
    res.set('X-Total-Count', totalComments);
    return res.status(200).json(comments);
});

// Get a comment by ID
export const getCommentById = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId).populate('author');
    if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
    }

    return res.status(200).json(comment);
});

// Update a comment
export const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    const comment = await Comment.findById(commentId);
    if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this comment' });
    }

    comment.content = content;
    comment.isEdited = true;

    await comment.save();
    return res.status(200).json(comment);
});

// Delete a comment
export const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.user._id.toString() && !req.user.isAdmin) {
        return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await comment.deleteOne();
    const post = await Post.findById(comment.postId);
    post.comments -= 1; // Decrement comment count on the post
    await post.save();

    return res.status(204).send();
});
