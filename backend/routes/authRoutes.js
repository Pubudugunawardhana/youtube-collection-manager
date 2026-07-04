const express = require('express');
const router = express.Router();
const { register, login, forgotPassword, resetPassword, getMe, updateProfile, updatePassword } = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', auth, getMe);
router.put('/profile', auth, updateProfile);
router.put('/password', auth, updatePassword);

module.exports = router;
