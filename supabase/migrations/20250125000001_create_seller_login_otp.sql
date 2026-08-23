-- Migration: Remove seller_login_otp table (OTP login feature removed)
-- OTP-based login has been removed. Login now returns a JWT token directly.
-- If this table exists from a previous version, drop it.

DROP TABLE IF EXISTS seller_login_otp;
