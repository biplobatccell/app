const express = require('express');
const router = express.Router();
const { User, Business, Category, Location } = require('../models');
const { authenticate } = require('../middleware/auth');
const { uploadSingle, uploadMultiple } = require('../middleware/upload');
const { body, validationResult } = require('express-validator');

// Get user profile
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch profile' });
  }
});

// Update user profile
router.put('/profile', authenticate, uploadSingle, async (req, res) => {
  try {
    const { name, dateOfBirth, gender, address, aadharNumber } = req.body;
    const updateData = {
      name,
      dateOfBirth,
      gender,
      address,
      aadharNumber
    };

    if (req.file) {
      updateData.photo = `/uploads/users/${req.file.filename}`;
    }

    await req.user.update(updateData);

    const updatedUser = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    res.json({ 
      success: true, 
      message: 'Profile updated successfully',
      data: updatedUser 
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
});

// Change password
router.post('/change-password', authenticate, [
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;

    // Verify current password
    const isPasswordValid = await req.user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    // Update password
    await req.user.update({ password: newPassword });

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, message: 'Failed to change password' });
  }
});

// Get all verified and active businesses
router.get('/businesses', authenticate, async (req, res) => {
  try {
    const businesses = await Business.findAll({
      where: {
        isVerified: true,
        isActive: true
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'name', 'email', 'mobile']
        },
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        },
        {
          model: Location,
          as: 'location',
          attributes: ['id', 'name', 'city', 'state']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ success: true, data: businesses });
  } catch (error) {
    console.error('Get businesses error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch businesses' });
  }
});

// Get user's own businesses
router.get('/my-businesses', authenticate, async (req, res) => {
  try {
    const businesses = await Business.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        },
        {
          model: Location,
          as: 'location',
          attributes: ['id', 'name', 'city', 'state']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ success: true, data: businesses });
  } catch (error) {
    console.error('Get my businesses error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch businesses' });
  }
});

// Get single business (only own)
router.get('/businesses/:id', authenticate, async (req, res) => {
  try {
    const business = await Business.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        },
        {
          model: Location,
          as: 'location',
          attributes: ['id', 'name', 'city', 'state']
        }
      ]
    });

    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found or unauthorized' });
    }

    res.json({ success: true, data: business });
  } catch (error) {
    console.error('Get business error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch business' });
  }
});

// Create business listing
router.post('/businesses', authenticate, uploadMultiple, [
  body('name').notEmpty().trim(),
  body('contactNumber').isMobilePhone(),
  body('address').notEmpty(),
  body('categoryId').isUUID(),
  body('locationId').isUUID()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    // Check if user is verified
    if (!req.user.isVerified) {
      return res.status(403).json({ 
        success: false, 
        message: 'Please complete your profile verification first' 
      });
    }

    const { name, contactNumber, email, address, categoryId, locationId } = req.body;

    // Process uploaded images
    const images = req.files ? req.files.map(file => `/uploads/businesses/${file.filename}`) : [];

    const business = await Business.create({
      userId: req.user.id,
      name,
      contactNumber,
      email: email || null, // Allow null/empty email
      address,
      categoryId,
      locationId,
      images,
      isVerified: false, // Requires admin approval
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: 'Business listing created successfully. Awaiting admin approval.',
      data: business
    });
  } catch (error) {
    console.error('Create business error:', error);
    res.status(500).json({ success: false, message: 'Failed to create business listing' });
  }
});

// Update business listing (only own listings)
router.put('/businesses/:id', authenticate, uploadMultiple, async (req, res) => {
  try {
    const business = await Business.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found or unauthorized' });
    }

    const { name, contactNumber, email, address, categoryId, locationId, existingImages } = req.body;

    const updateData = {
      name,
      contactNumber,
      email: email || null,
      address,
      categoryId,
      locationId
    };

    // Handle images: combine existing + new images
    let finalImages = [];
    
    // Parse existing images from request (sent as JSON string)
    if (existingImages) {
      try {
        finalImages = JSON.parse(existingImages);
      } catch (e) {
        finalImages = business.images || [];
      }
    }

    // Add new uploaded images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/businesses/${file.filename}`);
      finalImages = [...finalImages, ...newImages];
    }

    // Limit to max 5 images
    updateData.images = finalImages.slice(0, 5);

    // Reset verification status on update
    updateData.isVerified = false;

    await business.update(updateData);

    res.json({
      success: true,
      message: 'Business updated successfully. Awaiting admin re-approval.',
      data: business
    });
  } catch (error) {
    console.error('Update business error:', error);
    res.status(500).json({ success: false, message: 'Failed to update business' });
  }
});

// Delete business listing (only own listings)
router.delete('/businesses/:id', authenticate, async (req, res) => {
  try {
    const business = await Business.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found or unauthorized' });
    }

    await business.destroy();

    res.json({ success: true, message: 'Business deleted successfully' });
  } catch (error) {
    console.error('Delete business error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete business' });
  }
});

// Get all categories
router.get('/categories', authenticate, async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { isActive: true },
      order: [['name', 'ASC']]
    });

    res.json({ success: true, data: categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch categories' });
  }
});

// Get all locations
router.get('/locations', authenticate, async (req, res) => {
  try {
    const locations = await Location.findAll({
      where: { isActive: true },
      order: [['name', 'ASC']]
    });

    res.json({ success: true, data: locations });
  } catch (error) {
    console.error('Get locations error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch locations' });
  }
});

module.exports = router;
