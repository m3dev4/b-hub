import Like from '../models/likeModel.js';
import Post from '../models/postModel.js';
import Comment from '../models/commentModel.js';
import asyncHandler from '../middlewares/asyncHandler.middleware.js';
import mongoose from 'mongoose'; // Import mongoose for ObjectId validation
import { createNotification } from '../services/notifyService.js';

// Like content
export const likeContent = asyncHandler(async (req, res) => {
    const { contentType, contentId, reactionType } = req.body;

    // Validate contentType
    if (!['post', 'comment'].includes(contentType)) {
        return res.status(400).json({ message: 'Invalid content type' });
    }

    // Validate contentId
    let content;
    if (contentType === 'post') {
        content = await Post.findById(contentId);
    } else {
        content = await Comment.findById(contentId);
    }

    if (!content) {
        return res.status(404).json({ message: 'Content not found' });
    }

    // Check if the user has already liked the content
    const existingLike = await Like.findOne({ contentId, contentType, userId: req.user._id });
    if (existingLike) {
        return res.status(409).json({ message: 'User has already liked this content' });
    }

    // Create a new Like document
    const like = new Like({
        contentId,
        contentType,
        user: req.user._id,
        reactionType: reactionType || null,
    });

    await createNotification({
        recipient: content.author,
        type: 'like',
        content: `${req.user.userName} a aimé votre ${contentType}`,
        releatedPost: content._id,
        sender: req.user._id
    })

    await like.save();

    // Increment the like count on the associated content
    if (contentType === 'post') {
        content.likes += 1;
    } else {
        content.likes += 1; // Assuming Comment model has a likes field
    }
    await content.save();

    return res.status(201).json(like);
});

// Unlike content
export const unlikeContent = asyncHandler(async (req, res) => {
    const { likeId } = req.params;

    const like = await Like.findById(likeId);
    if (!like) {
        return res.status(404).json({ message: 'Like not found' });
    }

    if (like.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to unlike this content' });
    }

    // Decrement the like count on the associated content
    const content = like.contentType === 'post' ? await Post.findById(like.contentId) : await Comment.findById(like.contentId);
    if (content) {
        content.likes -= 1;
        await content.save();
    }

    await like.deleteOne();
    return res.status(204).send();
});

// Get likes by content
export const getLikesByContent = asyncHandler(async (req, res) => {
    const { contentType, contentId } = req.query;

    // Valider contentType
    if (!['post', 'comment'].includes(contentType)) {
        return res.status(400).json({ message: 'Type de contenu invalide' });
    }

    // Vérifier la présence de contentId
    if (!contentId) {
        return res.status(400).json({ message: 'contentId est requis' });
    }

    // Valider le format de contentId
    if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return res.status(400).json({ message: 'ID de contenu invalide' });
    }

    // Vérifier l'existence du contenu
    const content = contentType === 'post' 
        ? await Post.findById(contentId) 
        : await Comment.findById(contentId);
    if (!content) {
        return res.status(404).json({ message: 'Contenu non trouvé' });
    }

    // Récupérer les likes avec pagination
    const { page = 1, limit = 10 } = req.query;
    const likes = await Like.find({ contentId, contentType })
        .populate('userId', 'userName profilePicture')
        .skip((page - 1) * limit)
        .limit(limit);

    const totalLikes = await Like.countDocuments({ contentId, contentType });
    res.set('X-Total-Count', totalLikes);
    return res.status(200).json(likes);
});
