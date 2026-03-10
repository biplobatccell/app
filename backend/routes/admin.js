const express = require('express');
const router = express.Router();
const { User, Business, Category, Location, Session } = require('../models');
const { authenticateAdmin } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

// Admin Dashboard Statistics
router.get('/dashboard', authenticateAdmin, async (req, res) => {
  try {
    // Get counts
    const totalUsers = await User.count({ where: { role: 'user' } });
    const verifiedUsers = await User.count({ 
      where: { 
        role: 'user',
        isVerified: true 
      } 
    });
    const unverifiedUsers = totalUsers - verifiedUsers;
    const activeUsers = await User.count({ 
      where: { 
        role: 'user',
        isActive: true 
      } 
    });

    const totalBusinesses = await Business.count();
    const verifiedBusinesses = await Business.count({ where: { isVerified: true } });
    const pendingBusinesses = await Business.count({ where: { isVerified: false } });
    const activeBusinesses = await Business.count({ where: { isActive: true } });

    const totalCategories = await Category.count({ where: { isActive: true } });
    const totalLocations = await Location.count({ where: { isActive: true } });

    // Get recent registrations (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentUsers = await User.count({
      where: {
        role: 'user',
        createdAt: {
          [Op.gte]: thirtyDaysAgo
        }
      }
    });

    // Get daily registrations for chart (last 7 days)
    const dailyRegistrations = await User.findAll({
      attributes: [
        [sequelize.fn('DATE', sequelize.col('created_at')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: {
        role: 'user',
        createdAt: {
          [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      },
      group: [sequelize.fn('DATE', sequelize.col('created_at'))],
      order: [[sequelize.fn('DATE', sequelize.col('created_at')), 'ASC']],
      raw: true
    });

    // Get daily business listings (last 7 days)
    const dailyBusinesses = await Business.findAll({
      attributes: [
        [sequelize.fn('DATE', sequelize.col('created_at')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: {
        createdAt: {
          [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      },
      group: [sequelize.fn('DATE', sequelize.col('created_at'))],
      order: [[sequelize.fn('DATE', sequelize.col('created_at')), 'ASC']],
      raw: true
    });

    res.json({
      success: true,
      data: {
        statistics: {
          users: {
            total: totalUsers,
            verified: verifiedUsers,
            unverified: unverifiedUsers,
            active: activeUsers,
            recent: recentUsers
          },
          businesses: {
            total: totalBusinesses,
            verified: verifiedBusinesses,
            pending: pendingBusinesses,
            active: activeBusinesses
          },
          categories: totalCategories,
          locations: totalLocations
        },
        charts: {
          dailyRegistrations,
          dailyBusinesses
        }
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard data' });
  }
});

// Get all members with filters
router.get('/members', authenticateAdmin, async (req, res) => {
  try {
    const { verified, active, search } = req.query;
    
    const where = { role: 'user' };
    
    if (verified !== undefined) {
      where.isVerified = verified === 'true';
    }
    
    if (active !== undefined) {
      where.isActive = active === 'true';
    }

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { username: { [Op.like]: `%${search}%` } },
        { mobile: { [Op.like]: `%${search}%` } }
      ];
    }

    const members = await User.findAll({
      where,
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });

    res.json({ success: true, data: members });
  } catch (error) {
    console.error('Get members error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch members' });
  }
});

// Manually verify member
router.put('/members/:id/verify', authenticateAdmin, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    
    if (!user || user.role !== 'user') {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    await user.update({
      isEmailVerified: true,
      isMobileVerified: true,
      isAadharVerified: true,
      isVerified: true
    });

    res.json({ 
      success: true, 
      message: 'Member verified successfully',
      data: user
    });
  } catch (error) {
    console.error('Verify member error:', error);
    res.status(500).json({ success: false, message: 'Failed to verify member' });
  }
});

// Toggle member active status
router.put('/members/:id/toggle-status', authenticateAdmin, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    
    if (!user || user.role !== 'user') {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    await user.update({ isActive: !user.isActive });

    // Deactivate all sessions if user is being deactivated
    if (!user.isActive) {
      await Session.update(
        { isActive: false },
        { where: { userId: user.id } }
      );
    }

    res.json({ 
      success: true, 
      message: `Member ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      data: user
    });
  } catch (error) {
    console.error('Toggle member status error:', error);
    res.status(500).json({ success: false, message: 'Failed to update member status' });
  }
});

// Get all admins
router.get('/admins', authenticateAdmin, async (req, res) => {
  try {
    const admins = await User.findAll({
      where: { role: 'admin' },
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });

    res.json({ success: true, data: admins });
  } catch (error) {
    console.error('Get admins error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch admins' });
  }
});

// Create new admin
router.post('/create-admin', authenticateAdmin, [
  body('email').isEmail(),
  body('mobile').isMobilePhone(),
  body('password').isLength({ min: 6 }),
  body('name').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, mobile, password, name, username } = req.body;

    // Check if admin already exists
    const existingAdmin = await User.findOne({
      where: {
        [Op.or]: [{ email }, { mobile }, { username }]
      }
    });

    if (existingAdmin) {
      return res.status(400).json({ 
        success: false, 
        message: 'Admin with this email, mobile, or username already exists' 
      });
    }

    const admin = await User.create({
      username,
      email,
      mobile,
      password,
      name,
      role: 'admin',
      isEmailVerified: true,
      isMobileVerified: true,
      isAadharVerified: true,
      isVerified: true,
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      data: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        name: admin.name
      }
    });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ success: false, message: 'Failed to create admin' });
  }
});

// Get all businesses with filters
router.get('/businesses', authenticateAdmin, async (req, res) => {
  try {
    const { verified, active, search } = req.query;
    
    const where = {};
    
    if (verified !== undefined) {
      where.isVerified = verified === 'true';
    }
    
    if (active !== undefined) {
      where.isActive = active === 'true';
    }

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { contactNumber: { [Op.like]: `%${search}%` } }
      ];
    }

    const businesses = await Business.findAll({
      where,
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

// Approve/Verify business listing
router.put('/businesses/:id/approve', authenticateAdmin, async (req, res) => {
  try {
    const business = await Business.findByPk(req.params.id);
    
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found' });
    }

    await business.update({
      isVerified: true,
      verifiedAt: new Date(),
      verifiedBy: req.user.id
    });

    res.json({ 
      success: true, 
      message: 'Business approved successfully',
      data: business
    });
  } catch (error) {
    console.error('Approve business error:', error);
    res.status(500).json({ success: false, message: 'Failed to approve business' });
  }
});

// Toggle business active status
router.put('/businesses/:id/toggle-status', authenticateAdmin, async (req, res) => {
  try {
    const business = await Business.findByPk(req.params.id);
    
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found' });
    }

    await business.update({ isActive: !business.isActive });

    res.json({ 
      success: true, 
      message: `Business ${business.isActive ? 'activated' : 'deactivated'} successfully`,
      data: business
    });
  } catch (error) {
    console.error('Toggle business status error:', error);
    res.status(500).json({ success: false, message: 'Failed to update business status' });
  }
});

// Category Management
router.get('/categories', authenticateAdmin, async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['name', 'ASC']]
    });

    res.json({ success: true, data: categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch categories' });
  }
});

router.post('/categories', authenticateAdmin, [
  body('name').notEmpty().trim()
], async (req, res) => {
  try {
    const { name, description } = req.body;

    const category = await Category.create({
      name,
      description
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ success: false, message: 'Failed to create category' });
  }
});

router.put('/categories/:id', authenticateAdmin, async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const { name, description, isActive } = req.body;
    await category.update({ name, description, isActive });

    res.json({ 
      success: true, 
      message: 'Category updated successfully',
      data: category
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ success: false, message: 'Failed to update category' });
  }
});

router.delete('/categories/:id', authenticateAdmin, async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Check if category is being used
    const businessCount = await Business.count({ where: { categoryId: req.params.id } });
    if (businessCount > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot delete category with associated businesses' 
      });
    }

    await category.destroy();

    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete category' });
  }
});

// Location Management
router.get('/locations', authenticateAdmin, async (req, res) => {
  try {
    const locations = await Location.findAll({
      order: [['name', 'ASC']]
    });

    res.json({ success: true, data: locations });
  } catch (error) {
    console.error('Get locations error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch locations' });
  }
});

router.post('/locations', authenticateAdmin, [
  body('name').notEmpty().trim()
], async (req, res) => {
  try {
    const { name, city, state, pincode } = req.body;

    const location = await Location.create({
      name,
      city,
      state,
      pincode
    });

    res.status(201).json({
      success: true,
      message: 'Location created successfully',
      data: location
    });
  } catch (error) {
    console.error('Create location error:', error);
    res.status(500).json({ success: false, message: 'Failed to create location' });
  }
});

router.put('/locations/:id', authenticateAdmin, async (req, res) => {
  try {
    const location = await Location.findByPk(req.params.id);
    
    if (!location) {
      return res.status(404).json({ success: false, message: 'Location not found' });
    }

    const { name, city, state, pincode, isActive } = req.body;
    await location.update({ name, city, state, pincode, isActive });

    res.json({ 
      success: true, 
      message: 'Location updated successfully',
      data: location
    });
  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({ success: false, message: 'Failed to update location' });
  }
});

router.delete('/locations/:id', authenticateAdmin, async (req, res) => {
  try {
    const location = await Location.findByPk(req.params.id);
    
    if (!location) {
      return res.status(404).json({ success: false, message: 'Location not found' });
    }

    // Check if location is being used
    const businessCount = await Business.count({ where: { locationId: req.params.id } });
    if (businessCount > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot delete location with associated businesses' 
      });
    }

    await location.destroy();

    res.json({ success: true, message: 'Location deleted successfully' });
  } catch (error) {
    console.error('Delete location error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete location' });
  }
});

module.exports = router;
