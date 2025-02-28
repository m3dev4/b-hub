import User from '../models/userModel.js';
import Follow from '../models/followModel.js';
import asyncHandler from '../middlewares/asyncHandler.middleware.js';
import { createNotification } from '../services/notifyService.js';

// Follow a user
export const followUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const followerId = req.user._id;

    // Check if user exists
    const userToFollow = await User.findById(userId);
    if (!userToFollow) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Check if already following
    const existingFollow = await Follow.findOne({ follower: followerId, following: userId });
    if (existingFollow) {
        return res.status(400).json({ message: 'Vous suivez déjà cet utilisateur' });
    }

    // Create new follow
    const follow = new Follow({
        follower: followerId,
        following: userId
    });

    await follow.save();

    // Update follower/following counts
    await User.findByIdAndUpdate(followerId, { $inc: { followingCount: 1 } });
    await User.findByIdAndUpdate(userId, { $inc: { followersCount: 1 } });

    // Create notification
    await createNotification({
        recipient: userId,
        type: 'follow',
        content: `${req.user.userName} a commencé à vous suivre`,
        sender: followerId
    });

    res.status(201).json({ message: 'Utilisateur suivi avec succès' });
});

// Unfollow a user
export const unfollowUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const followerId = req.user._id;

    // Check if follow exists
    const follow = await Follow.findOne({ follower: followerId, following: userId });
    if (!follow) {
        return res.status(404).json({ message: 'Vous ne suivez pas cet utilisateur' });
    }

    await follow.deleteOne();

    // Update follower/following counts
    await User.findByIdAndUpdate(followerId, { $inc: { followingCount: -1 } });
    await User.findByIdAndUpdate(userId, { $inc: { followersCount: -1 } });

    res.status(200).json({ message: 'Utilisateur non suivi avec succès' });
});

// Get followers
export const getFollowers = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const followers = await Follow.find({ following: userId })
        .populate('follower', 'userName profilePicture')
        .skip((page - 1) * limit)
        .limit(limit);

    const total = await Follow.countDocuments({ following: userId });

    res.set('X-Total-Count', total);
    res.status(200).json(followers);
});

// Get following
export const getFollowing = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const following = await Follow.find({ follower: userId })
        .populate('following', 'userName profilePicture')
        .skip((page - 1) * limit)
        .limit(limit);

    const total = await Follow.countDocuments({ follower: userId });

    res.set('X-Total-Count', total);
    res.status(200).json(following);
});
