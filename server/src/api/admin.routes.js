import express from 'express';
import { protect, adminOnly } from '../middleware/auth.middleware.js';
import {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getSystemLogs,
} from '../controllers/admin.controller.js';

const router = express.Router();

// All admin routes require admin authentication
router.use(protect, adminOnly);

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);
router.get('/logs', getSystemLogs);

export default router;