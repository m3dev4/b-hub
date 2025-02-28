import express from 'express';
import { followUser, unfollowUser, getFollowers, getFollowing } from '../controllers/followController.js';
import {  isAuthenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Routes protégées nécessitant une authentification
router.use(isAuthenticate);

router.post('/:userId', followUser);
router.delete('/:userId', unfollowUser);
router.get('/:userId/followers', getFollowers);
router.get('/:userId/following', getFollowing);

export default router;
