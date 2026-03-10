// Mock OTP Service - Replace with real API integration

const { OTPVerification } = require('../models');
const { Op } = require('sequelize');

// Generate random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send Email OTP (Mock Implementation)
const sendEmailOTP = async (email, type = 'email') => {
  try {
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete old OTPs for this email and type
    await OTPVerification.destroy({
      where: {
        identifier: email,
        type: type,
        isVerified: false
      }
    });

    // Create new OTP
    await OTPVerification.create({
      identifier: email,
      otp,
      type,
      expiresAt
    });

    // Mock: Log OTP to console (Replace with actual email service)
    console.log(`\n=== EMAIL OTP ===`);
    console.log(`To: ${email}`);
    console.log(`OTP: ${otp}`);
    console.log(`Type: ${type}`);
    console.log(`Expires: ${expiresAt}`);
    console.log(`=================\n`);

    return { success: true, message: 'OTP sent successfully' };
  } catch (error) {
    console.error('Error sending email OTP:', error);
    return { success: false, message: 'Failed to send OTP' };
  }
};

// Send Mobile OTP (Mock Implementation)
const sendMobileOTP = async (mobile, type = 'mobile') => {
  try {
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete old OTPs for this mobile and type
    await OTPVerification.destroy({
      where: {
        identifier: mobile,
        type: type,
        isVerified: false
      }
    });

    // Create new OTP
    await OTPVerification.create({
      identifier: mobile,
      otp,
      type,
      expiresAt
    });

    // Mock: Log OTP to console (Replace with actual SMS service like Twilio)
    console.log(`\n=== MOBILE OTP ===`);
    console.log(`To: ${mobile}`);
    console.log(`OTP: ${otp}`);
    console.log(`Type: ${type}`);
    console.log(`Expires: ${expiresAt}`);
    console.log(`==================\n`);

    return { success: true, message: 'OTP sent successfully' };
  } catch (error) {
    console.error('Error sending mobile OTP:', error);
    return { success: false, message: 'Failed to send OTP' };
  }
};

// Verify OTP
const verifyOTP = async (identifier, otp, type) => {
  try {
    const otpRecord = await OTPVerification.findOne({
      where: {
        identifier,
        otp,
        type,
        isVerified: false,
        expiresAt: {
          [Op.gt]: new Date()
        }
      }
    });

    if (!otpRecord) {
      return { success: false, message: 'Invalid or expired OTP' };
    }

    // Mark as verified
    await otpRecord.update({ isVerified: true });

    return { success: true, message: 'OTP verified successfully' };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return { success: false, message: 'Failed to verify OTP' };
  }
};

// Verify Aadhar (Mock Implementation)
const verifyAadhar = async (aadharNumber) => {
  try {
    // Mock: Auto-approve Aadhar verification
    // Replace with actual Aadhar verification API
    
    console.log(`\n=== AADHAR VERIFICATION ===`);
    console.log(`Aadhar Number: ${aadharNumber}`);
    console.log(`Status: VERIFIED (Mock)`);
    console.log(`===========================\n`);

    return { 
      success: true, 
      message: 'Aadhar verified successfully',
      verified: true 
    };
  } catch (error) {
    console.error('Error verifying Aadhar:', error);
    return { success: false, message: 'Failed to verify Aadhar' };
  }
};

module.exports = {
  generateOTP,
  sendEmailOTP,
  sendMobileOTP,
  verifyOTP,
  verifyAadhar
};
