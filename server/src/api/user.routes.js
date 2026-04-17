import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
  getCurrentUser,
  updateProfile,
  getWatchHistory,
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  updatePreferences,
} from '../controllers/user.controller.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/me', getCurrentUser);
router.put('/profile', updateProfile);
router.put('/preferences', updatePreferences);

router.get('/history', getWatchHistory);
router.get('/favorites', getFavorites);
router.post('/favorites/:titleId', addToFavorites);
router.delete('/favorites/:titleId', removeFromFavorites);

export default router;