import express from 'express';
import { login, register } from '../controllers/Auth.js';
import { createPost } from '../controllers/createPost.js';
import { fetchAllPosts, fetchAllStories, fetchUserImg, fetchUserName } from '../controllers/Posts.js';
import { searchUsers } from '../controllers/searchUsers.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/createPost', verifyToken, createPost);
router.get('/fetchAllPosts', verifyToken, fetchAllPosts);
router.get('/fetchUserName', verifyToken, fetchUserName);
router.get('/fetchUserImg', verifyToken, fetchUserImg);
router.get('/fetchAllStories', verifyToken, fetchAllStories);
router.get('/search-users', verifyToken, searchUsers);

export default router;