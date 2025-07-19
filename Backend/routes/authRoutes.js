import express from 'express';
import { signupUser, loginUser , updateUserProfile } from '../controllers/authController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', signupUser);
router.post('/login', loginUser);
router.get('/me', protect, (req, res) => {
  res.status(200).json({
    message: 'User verified ✅',
    user: req.user
  });
});
router.put("/profile/update", protect, updateUserProfile);

export default router; 
