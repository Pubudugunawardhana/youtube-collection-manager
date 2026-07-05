const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  console.log('HIT REGISTER', req.body);
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      console.log('User already exists');
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ email, password: hashedPassword });
    await user.save();

    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
      if (err) throw err;
      console.log('Token created', token);
      res.status(201).json({ token });
    });
  } catch (err) {
    console.error('CATCH BLOCK:', err);
    res.status(500).json({ message: 'Server error', error: err.message, stack: err.stack });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const sendEmail = require('../utils/sendEmail');

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
       return res.status(404).json({ message: 'User not found' });
    }
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpires = Date.now() + 15 * 60 * 1000; // 15 mins
    await user.save();
    
    const message = `You requested a password reset. Your 6-digit reset code is: ${otp}\nThis code is valid for 15 minutes.`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
        <h2 style="color: #9333ea; text-align: center; margin-bottom: 0;">FocusTube</h2>
        <h3 style="color: #333; text-align: center; margin-top: 5px;">Password Reset Request</h3>
        <p style="color: #555;">You are receiving this email because you (or someone else) requested a password reset for your account.</p>
        <p style="color: #555;">Your 6-digit verification code is:</p>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <h1 style="letter-spacing: 5px; color: #111; margin: 0;">${otp}</h1>
        </div>
        <p style="color: #777; font-size: 12px; text-align: center;">This code will expire in 15 minutes. If you did not request this, please ignore this email.</p>
      </div>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'FocusTube - Password Reset Token',
        message,
        html
      });

      res.json({ message: 'Password reset instructions sent to email!' });
    } catch (error) {
      console.error('Email could not be sent', error);
      return res.status(500).json({ message: 'Email could not be sent' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({ message: 'Please provide email and OTP' });
    }

    const user = await User.findOne({ 
      email, 
      resetPasswordOtp: otp,
      resetPasswordOtpExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP code' });
    }

    res.json({ message: 'OTP verified successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'Please provide email, OTP, and new password' });
    }

    const user = await User.findOne({ 
      email, 
      resetPasswordOtp: otp,
      resetPasswordOtpExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP code' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpires = undefined;
    await user.save();

    res.json({ message: 'Password has been reset successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, profilePicture } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name !== undefined) user.name = name;
    if (profilePicture !== undefined) user.profilePicture = profilePicture;

    await user.save();
    res.json({ message: 'Profile updated successfully', user: { name: user.name, profilePicture: user.profilePicture } });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect current password' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const deleteProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const Collection = require('../models/Collection');
    const Video = require('../models/Video');

    // Find all collections for the user
    const collections = await Collection.find({ user: userId });
    const collectionIds = collections.map(c => c._id);

    // Delete all videos associated with those collections
    await Video.deleteMany({ collectionId: { $in: collectionIds } });

    // Delete all collections
    await Collection.deleteMany({ user: userId });

    // Delete the user
    await User.findByIdAndDelete(userId);

    res.json({ message: 'User profile and all associated data deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = { register, login, forgotPassword, verifyResetOtp, resetPassword, getMe, updateProfile, updatePassword, deleteProfile };
