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
    
    const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    
    // Create reset URL (pointing to the frontend route you will build to reset the password)
    // Note: ensure your frontend is running on localhost:3000
    const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;
    
    const message = `You are receiving this email because you (or someone else) requested the reset of a password. Please click on the link below to reset your password:\n\n${resetUrl}`;
    
    const html = `
      <h3>Password Reset Request</h3>
      <p>You are receiving this email because you (or someone else) requested the reset of a password.</p>
      <p>Please click on the link below to reset your password:</p>
      <a href="${resetUrl}" target="_blank">Reset Password</a>
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

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password has been reset successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ message: 'Invalid or expired token' });
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

module.exports = { register, login, forgotPassword, resetPassword, getMe, updateProfile, updatePassword };
