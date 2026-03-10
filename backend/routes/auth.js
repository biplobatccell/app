const express = require('express');
const router = express.Router();
const { User, Session } = require('../models');
const { generateToken } = require('../middleware/auth');
const { sendEmailOTP, sendMobileOTP, verifyOTP, verifyAadhar } = require('../utils/otpService');
const { generateUsername } = require('../utils/usernameGenerator');
const { uploadSingle } = require('../middleware/upload');
const { body, validationResult } = require('express-validator');
const { Op } = require('sequelize');

// Register Step 1: Create user account
router.post('/register', uploadSingle, [
  body('email').isEmail().normalizeEmail(),
  body('mobile').isMobilePhone(),
  body('password').isLength({ min: 6 }),
  body('name').notEmpty().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, mobile, password, name, dateOfBirth, gender, address, aadharNumber } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { mobile }]
      }
    });

    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'User with this email or mobile already exists' 
      });
    }

    // Generate unique username
    const username = await generateUsername(name);

    // Create user
    const user = await User.create({
      username,
      email,
      mobile,
      password,
      name,
      dateOfBirth,
      gender,
      address,
      aadharNumber,
      photo: req.file ? `/uploads/users/${req.file.filename}` : null
    });

    // Send OTPs for verification
    await sendEmailOTP(email, 'email');
    await sendMobileOTP(mobile, 'mobile');

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please verify your email and mobile.',
      data: {
        userId: user.id,
        username: user.username,
        email: user.email,
        mobile: user.mobile
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
  }
});

// Verify Email OTP
router.post('/verify-email', [
  body('email').isEmail(),
  body('otp').isLength({ min: 6, max: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, otp } = req.body;

    const result = await verifyOTP(email, otp, 'email');
    
    if (!result.success) {
      return res.status(400).json(result);
    }

    // Update user verification status
    const user = await User.findOne({ where: { email } });
    if (user) {
      await user.update({ isEmailVerified: true });
      
      // Check if all verifications are complete
      if (user.isEmailVerified && user.isMobileVerified && user.isAadharVerified) {
        await user.update({ isVerified: true });
      }
    }

    res.json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ success: false, message: 'Verification failed' });
  }
});

// Verify Mobile OTP
router.post('/verify-mobile', [
  body('mobile').isMobilePhone(),
  body('otp').isLength({ min: 6, max: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { mobile, otp } = req.body;

    const result = await verifyOTP(mobile, otp, 'mobile');
    
    if (!result.success) {
      return res.status(400).json(result);
    }

    // Update user verification status
    const user = await User.findOne({ where: { mobile } });
    if (user) {
      await user.update({ isMobileVerified: true });
      
      // Check if all verifications are complete
      if (user.isEmailVerified && user.isMobileVerified && user.isAadharVerified) {
        await user.update({ isVerified: true });
      }
    }

    res.json({ success: true, message: 'Mobile verified successfully' });
  } catch (error) {
    console.error('Mobile verification error:', error);
    res.status(500).json({ success: false, message: 'Verification failed' });
  }
});

// Verify Aadhar
router.post('/verify-aadhar', [
  body('aadharNumber').isLength({ min: 12, max: 12 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { aadharNumber, userId } = req.body;

    const result = await verifyAadhar(aadharNumber);
    
    if (!result.success) {
      return res.status(400).json(result);
    }

    // Update user verification status
    const user = await User.findByPk(userId);
    if (user) {
      await user.update({ isAadharVerified: true });
      
      // Check if all verifications are complete
      if (user.isEmailVerified && user.isMobileVerified && user.isAadharVerified) {
        await user.update({ isVerified: true });
      }
    }

    res.json({ success: true, message: 'Aadhar verified successfully' });
  } catch (error) {
    console.error('Aadhar verification error:', error);
    res.status(500).json({ success: false, message: 'Verification failed' });
  }
});

// Login Step 1: Verify credentials and send OTP
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier can be username, email, or mobile

    // Find user by username, email, or mobile
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { username: identifier },
          { email: identifier },
          { mobile: identifier }
        ]
      }
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account is inactive' });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Send login OTP to email
    await sendEmailOTP(user.email, 'login');

    res.json({
      success: true,
      message: 'OTP sent to your email for login verification',
      data: {
        userId: user.id,
        email: user.email,
        requiresOTP: true
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});

// Login Step 2: Verify OTP and create session
router.post('/verify-login', async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Verify OTP
    const result = await verifyOTP(user.email, otp, 'login');
    if (!result.success) {
      return res.status(400).json(result);
    }

    // Generate JWT token
    const token = generateToken(user.id, user.role);

    // Create session (7 days)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await Session.create({
      userId: user.id,
      token,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      expiresAt,
      isActive: true
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name,
          role: user.role,
          isVerified: user.isVerified,
          photo: user.photo
        }
      }
    });
  } catch (error) {
    console.error('Login verification error:', error);
    res.status(500).json({ success: false, message: 'Login verification failed' });
  }
});

// Resend OTP
router.post('/resend-otp', async (req, res) => {
  try {
    const { identifier, type } = req.body; // type: 'email', 'mobile', 'login'

    if (type === 'email' || type === 'login') {
      await sendEmailOTP(identifier, type);
    } else if (type === 'mobile') {
      await sendMobileOTP(identifier, type);
    } else {
      return res.status(400).json({ success: false, message: 'Invalid OTP type' });
    }

    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
});

// Forgot Password
router.post('/forgot-password', [
  body('email').isEmail()
], async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Send OTP for password reset
    await sendEmailOTP(email, 'email');

    res.json({
      success: true,
      message: 'Password reset OTP sent to your email',
      data: { userId: user.id }
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: 'Failed to process request' });
  }
});

// Reset Password
router.post('/reset-password', [
  body('email').isEmail(),
  body('otp').isLength({ min: 6, max: 6 }),
  body('newPassword').isLength({ min: 6 })
], async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Verify OTP
    const result = await verifyOTP(email, otp, 'email');
    if (!result.success) {
      return res.status(400).json(result);
    }

    // Update password
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await user.update({ password: newPassword });

    // Invalidate all sessions
    await Session.update(
      { isActive: false },
      { where: { userId: user.id } }
    );

    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: 'Failed to reset password' });
  }
});

// Logout
router.post('/logout', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      // Deactivate session
      await Session.update(
        { isActive: false },
        { where: { token } }
      );
    }

    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ success: false, message: 'Logout failed' });
  }
});

module.exports = router;
