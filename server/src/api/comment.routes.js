import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
  getComments,
  addComment,
  likeComment,
} from '../controllers/comment.controller.js';

const router = express.Router();

router.get('/episode/:episodeId', getComments);
router.post('/episode/:episodeId', protect, addComment);
router.post('/:id/like', protect, likeComment);

export default router;