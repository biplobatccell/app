const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { sequelize, User, Category, Location } = require('./models');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 8001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Jain Connect API is running',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// Initialize database and start server
const initializeDatabase = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Sync all models (create tables if they don't exist)
    // Use force: true only for first time setup, then change to false
    await sequelize.sync({ force: false });
    console.log('✅ All models synchronized successfully.');

    // Create default categories if none exist
    const categoryCount = await Category.count();
    if (categoryCount === 0) {
      const defaultCategories = [
        { name: 'Restaurant', description: 'Food and dining services' },
        { name: 'Retail', description: 'Retail stores and shops' },
        { name: 'Services', description: 'Professional services' },
        { name: 'Healthcare', description: 'Medical and healthcare services' },
        { name: 'Education', description: 'Educational institutions' },
        { name: 'Manufacturing', description: 'Manufacturing businesses' },
        { name: 'Technology', description: 'IT and technology services' },
        { name: 'Real Estate', description: 'Property and real estate' }
      ];
      
      await Category.bulkCreate(defaultCategories);
      console.log('✅ Default categories created.');
    }

    // Create default locations if none exist
    const locationCount = await Location.count();
    if (locationCount === 0) {
      const defaultLocations = [
        { name: 'Mumbai', city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
        { name: 'Delhi', city: 'Delhi', state: 'Delhi', pincode: '110001' },
        { name: 'Bangalore', city: 'Bangalore', state: 'Karnataka', pincode: '560001' },
        { name: 'Ahmedabad', city: 'Ahmedabad', state: 'Gujarat', pincode: '380001' },
        { name: 'Pune', city: 'Pune', state: 'Maharashtra', pincode: '411001' },
        { name: 'Jaipur', city: 'Jaipur', state: 'Rajasthan', pincode: '302001' },
        { name: 'Surat', city: 'Surat', state: 'Gujarat', pincode: '395001' },
        { name: 'Indore', city: 'Indore', state: 'Madhya Pradesh', pincode: '452001' }
      ];
      
      await Location.bulkCreate(defaultLocations);
      console.log('✅ Default locations created.');
    }

    // Create default admin if none exists
    const adminCount = await User.count({ where: { role: 'admin' } });
    if (adminCount === 0) {
      await User.create({
        username: 'admin',
        email: 'admin@jainconnect.com',
        mobile: '9999999999',
        password: 'admin123',
        name: 'Admin User',
        role: 'admin',
        isEmailVerified: true,
        isMobileVerified: true,
        isAadharVerified: true,
        isVerified: true,
        isActive: true
      });
      console.log('✅ Default admin created (username: admin, password: admin123)');
    }

    // Start server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📍 API Base URL: http://localhost:${PORT}/api`);
      console.log(`🔐 Default Admin Login: username: admin, password: admin123`);
    });
  } catch (error) {
    console.error('❌ Unable to initialize database:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server');
  await sequelize.close();
  process.exit(0);
});

// Initialize
initializeDatabase();

module.exports = app;
