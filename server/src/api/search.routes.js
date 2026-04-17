import express from 'express';
import { searchTitles } from '../controllers/search.controller.js';

const router = express.Router();

router.get('/', searchTitles);

export default router;