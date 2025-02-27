import mongoose from 'mongoose';
import User from '../../models/userModel.js';

// Function to validate media URLs
export const validateMediaUrls = (urls) => {
    const urlRegex = /^(https?:\/\/[^\s]+)/; // Simple regex for URL validation
    return urls.every(url => urlRegex.test(url));
};

// Function to validate mentions
export const validateMentions = async (mentions) => {
    // Check if all mentions are valid ObjectIds
    if (!mentions.every(id => mongoose.Types.ObjectId.isValid(id))) {
        return false; // Return false if any ID is invalid
    }

    const users = await User.find({ _id: { $in: mentions } });
    return users.length === mentions.length; // Check if all mentioned users exist
};
