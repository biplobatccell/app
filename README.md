# Jain Connect - Full Application Documentation

## 🎉 Application Overview

**Jain Connect** is a complete business directory platform with user and admin sections, built with:
- **Backend**: Node.js + Express + MySQL (JavaScript)
- **Frontend**: Vite + React + Tailwind CSS
- **Database**: MySQL (Auto-schema creation with Sequelize ORM)
- **Authentication**: JWT with 7-day sessions

---

## 🔐 Default Credentials

### Admin Access
- **Username**: `admin`
- **Password**: `admin123`
- **Access URL**: `/app` (redirects to login)

### Test User
You can register a new user through the registration page.

---

## 📊 System Architecture

### Backend (Node.js/Express) - Port 8001
**Location**: `/app/backend/`

#### Key Files:
- `server.js` - Main Express server
- `models/` - Sequelize ORM models (Users, Businesses, Categories, Locations, Sessions, OTP)
- `routes/` - API endpoints (auth, user, admin)
- `middleware/` - Authentication & File upload
- `utils/` - OTP service, username generator

#### Database Schema (Auto-created):
1. **users** - User accounts with verification status
2. **businesses** - Business listings
3. **categories** - Business categories
4. **locations** - Geographic locations
5. **sessions** - JWT session management (7-day retention)
6. **otp_verifications** - OTP tracking

### Frontend (Vite + React) - Port 3000
**Location**: `/app/frontend/`

#### Key Components:
- `src/App.jsx` - Main app with routing
- `src/context/AuthContext.jsx` - Authentication state management
- `src/pages/` - All page components
- `src/utils/api.js` - Axios API client

---

## 🚀 Features Implemented

### User Section
✅ **Registration Process**:
  - Multi-step form with personal details
  - Photo upload
  - Email OTP verification (MOCKED - check console logs)
  - Mobile OTP verification (MOCKED - check console logs)
  - Aadhar verification (MOCKED - auto-approved)
  - Auto-generated unique username

✅ **Login System**:
  - Login with username/email/mobile
  - Email OTP on every login (MOCKED)
  - 7-day session management
  - JWT token authentication

✅ **User Dashboard**:
  - View all verified business listings
  - View own business listings
  - Add new business listing (with up to 5 images)
  - Edit own listings
  - Delete own listings
  - Profile management

✅ **Profile Management**:
  - Update personal information
  - Change password
  - Upload profile photo
  - Forgot password with OTP

### Admin Section
✅ **Dashboard**:
  - Statistics overview (users, businesses, categories, locations)
  - Charts for registrations and listings (last 7 days)
  - Real-time data visualization with Recharts

✅ **Member Management**:
  - View all members (filter by verified/unverified)
  - Manually verify members
  - Activate/Deactivate member accounts
  - Search functionality

✅ **Business Management**:
  - View all business listings
  - Approve/Reject listings
  - Activate/Deactivate listings
  - Filter by verification status

✅ **Category Management**:
  - Add/Edit/Delete categories
  - Default categories included

✅ **Location Management**:
  - Add/Edit/Delete locations
  - Default locations included

✅ **Admin Management**:
  - Create new admin accounts
  - Full role-based access control

---

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - User registration
- `POST /verify-email` - Verify email OTP
- `POST /verify-mobile` - Verify mobile OTP
- `POST /verify-aadhar` - Verify Aadhar
- `POST /login` - Step 1: Send login OTP
- `POST /verify-login` - Step 2: Verify OTP and login
- `POST /resend-otp` - Resend OTP
- `POST /forgot-password` - Initiate password reset
- `POST /reset-password` - Reset password with OTP
- `POST /logout` - Logout and invalidate session

### User Routes (`/api/user`)
- `GET /profile` - Get user profile
- `PUT /profile` - Update profile
- `POST /change-password` - Change password
- `GET /businesses` - Get all verified businesses
- `GET /my-businesses` - Get own businesses
- `POST /businesses` - Create business listing
- `PUT /businesses/:id` - Update own listing
- `DELETE /businesses/:id` - Delete own listing
- `GET /categories` - Get all categories
- `GET /locations` - Get all locations

### Admin Routes (`/api/admin`)
- `GET /dashboard` - Dashboard statistics
- `GET /members` - Get all members
- `PUT /members/:id/verify` - Verify member
- `PUT /members/:id/toggle-status` - Toggle member status
- `POST /create-admin` - Create new admin
- `GET /businesses` - Get all businesses
- `PUT /businesses/:id/approve` - Approve business
- `PUT /businesses/:id/toggle-status` - Toggle business status
- `GET /categories` - Get categories
- `POST /categories` - Create category
- `PUT /categories/:id` - Update category
- `DELETE /categories/:id` - Delete category
- `GET /locations` - Get locations
- `POST /locations` - Create location
- `PUT /locations/:id` - Update location
- `DELETE /locations/:id` - Delete location

---

## 📝 Mock Implementations

**Important**: The following features are MOCKED for testing:

### 1. Email OTP
- OTPs are logged to backend console
- Check `/var/log/supervisor/backend.out.log` for OTPs
- Replace with real email service (Resend, SendGrid, etc.)

### 2. Mobile OTP
- OTPs are logged to backend console
- Replace with Twilio SMS or similar service

### 3. Aadhar Verification
- Auto-approves all Aadhar numbers
- Replace with actual Aadhar verification API

**To view OTPs**: 
```bash
tail -f /var/log/supervisor/backend.out.log
```

---

## 🗂️ File Upload Configuration

### Storage Location
- User photos: `/app/backend/uploads/users/`
- Business images: `/app/backend/uploads/businesses/`

### Limits
- Max file size: 5MB per file
- Max business images: 5 per listing
- Allowed formats: jpeg, jpg, png, gif, webp

### Access URLs
- Files accessible at: `http://localhost:8001/uploads/...`

---

## 🔧 Environment Configuration

### Backend (.env)
```
DB_HOST=119.18.54.125
DB_PORT=3306
DB_NAME=nxtgevr4_jainconnect
DB_USER=nxtgevr4_biplob
DB_PASSWORD=Biplob@@00@@
JWT_SECRET=jain_connect_super_secret_key_2024_secure_token
JWT_EXPIRE=7d
PORT=8001
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:8001/api
```

---

## 🎨 UI/UX Features

### Design System
- **Colors**:
  - Primary: Orange (#FF6B35)
  - Secondary: Blue (#004E89)
  - Accent: Orange (#F7931E)
  
- **Components**:
  - Responsive design (mobile-first)
  - Tailwind CSS utilities
  - Modern card-based layouts
  - Loading states and animations
  - Form validation
  - Toast notifications

### Pages
1. Login page with OTP verification
2. Multi-step registration
3. User dashboard with tabs
4. Business listing cards
5. Profile management
6. Admin dashboard with sidebar
7. Data tables and charts

---

## 🧪 Testing the Application

### 1. Test User Registration
1. Go to `/app/register`
2. Fill in all details
3. Check backend logs for Email OTP
4. Verify email with OTP from logs
5. Check logs for Mobile OTP
6. Verify mobile with OTP
7. Verify Aadhar (auto-approved)
8. Registration complete!

### 2. Test User Login
1. Go to `/app/login`
2. Enter username/email/mobile and password
3. Check backend logs for Login OTP
4. Enter OTP to complete login
5. Redirected to user dashboard

### 3. Test Admin Login
1. Go to `/app/login`
2. Username: `admin`, Password: `admin123`
3. Check logs for OTP
4. Enter OTP
5. Redirected to admin dashboard

### 4. View OTPs in Real-time
```bash
tail -f /var/log/supervisor/backend.out.log
```

---

## 🚦 Service Management

### Check Status
```bash
sudo supervisorctl status
```

### Restart Services
```bash
# Restart all
sudo supervisorctl restart all

# Restart backend only
sudo supervisorctl restart backend

# Restart frontend only
sudo supervisorctl restart frontend
```

### View Logs
```bash
# Backend logs
tail -f /var/log/supervisor/backend.out.log
tail -f /var/log/supervisor/backend.err.log

# Frontend logs
tail -f /var/log/supervisor/frontend.out.log
tail -f /var/log/supervisor/frontend.err.log
```

---

## 📦 Dependencies

### Backend (Node.js)
```json
{
  "express": "^4.18.2",
  "mysql2": "^3.6.5",
  "sequelize": "^6.35.2",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.2",
  "multer": "^1.4.5-lts.1",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "express-validator": "^7.0.1"
}
```

### Frontend (React)
```json
{
  "react": "^19.0.0",
  "react-router-dom": "^7.13.1",
  "axios": "^1.13.6",
  "tailwindcss": "^4.2.1",
  "recharts": "^3.8.0"
}
```

---

## 🔐 Security Features

1. **Password Hashing**: bcrypt with 10 salt rounds
2. **JWT Authentication**: 7-day expiration
3. **Session Management**: Database-backed sessions
4. **OTP Expiration**: 10 minutes
5. **Role-Based Access Control**: User vs Admin
6. **Input Validation**: express-validator
7. **File Upload Security**: Type and size validation

---

## 🌐 Access URLs

- **Frontend**: http://localhost:3000/app
- **Backend API**: http://localhost:8001/api
- **Health Check**: http://localhost:8001/api/health

---

## 📋 Next Steps to Production

To make this production-ready:

1. **Replace Mock Services**:
   - Integrate real Email service (Resend, SendGrid)
   - Integrate SMS service (Twilio)
   - Integrate Aadhar verification API

2. **Security Enhancements**:
   - Add rate limiting
   - Implement CSRF protection
   - Add input sanitization
   - Use HTTPS in production
   - Rotate JWT secrets regularly

3. **File Storage**:
   - Move to cloud storage (AWS S3, Cloudinary)
   - Add image optimization
   - Implement CDN

4. **Performance**:
   - Add database indexing (already done)
   - Implement caching (Redis)
   - Add pagination for large datasets
   - Optimize API responses

5. **Monitoring**:
   - Add error tracking (Sentry)
   - Implement logging (Winston)
   - Add analytics

---

## 🎯 Summary

✅ **Complete backend** in JavaScript (Node.js + Express)
✅ **Complete frontend** in React + Vite + Tailwind
✅ **MySQL database** with auto-schema creation
✅ **User authentication** with JWT and OTP
✅ **Admin panel** with full CRUD operations
✅ **Business listing** system with approval workflow
✅ **Profile management** for users
✅ **Category & location** management
✅ **File uploads** for photos and images
✅ **Charts and analytics** for admin dashboard
✅ **Responsive design** for all screen sizes

**All features are fully functional and ready for testing!**

---

## 📞 Support

For any issues:
1. Check backend logs: `tail -f /var/log/supervisor/backend.out.log`
2. Check frontend logs: `tail -f /var/log/supervisor/frontend.out.log`
3. Verify services: `sudo supervisorctl status`
4. Test APIs: `curl http://localhost:8001/api/health`

---

**Built with ❤️ for Jain Connect Community**
