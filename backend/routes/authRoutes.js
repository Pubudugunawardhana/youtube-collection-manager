const express = require('express');
const router = express.Router();
const { register, login, forgotPassword, verifyResetOtp, resetPassword, getMe, updateProfile, updatePassword, deleteProfile } = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-otp', verifyResetOtp);
router.post('/reset-password', resetPassword);
router.get('/me', auth, getMe);
router.put('/profile', auth, updateProfile);
router.put('/password', auth, updatePassword);
router.delete('/profile', auth, deleteProfile);

module.exports = router;
