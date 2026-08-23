const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const pool = require('./db');
const {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword
} = require('./middleware/validation');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// POST /api/sellers/register
router.post('/register', validateRegister, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query('SELECT * FROM sellers WHERE email = $1', [email]);
    if (user.rows.length > 0) {
      return res.status(401).send('Seller already exists.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newSeller = await pool.query(
      'INSERT INTO sellers (email, password_hash) VALUES ($1, $2) RETURNING id, email',
      [email, passwordHash]
    );

    const token = jwt.sign(
      { sellerId: newSeller.rows[0].id },
      process.env.JWT_SECRET
    );

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// POST /api/sellers/login
router.post('/login', loginLimiter, validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query('SELECT * FROM sellers WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const seller = user.rows[0];

    const isPasswordValid = await bcrypt.compare(password, seller.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { sellerId: seller.id },
      process.env.JWT_SECRET
    );

    res.json({ token });
  } catch (err) {
    console.error('[AUTH] Login error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/sellers/forgot-password
router.post('/forgot-password', validateForgotPassword, async (req, res) => {
  try {
    const { email } = req.body;

    const user = await pool.query('SELECT * FROM sellers WHERE email = $1', [email]);

    if (user.rows.length === 0) {
      return res.json({ msg: 'If an account with this email exists, a reset link has been sent.' });
    }

    const sellerId = user.rows[0].id;

    const resetToken = jwt.sign(
      { sellerId },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

    console.log('=============== PASSWORD RESET ================');
    console.log(`Reset link for ${email}:`);
    console.log(resetLink);
    console.log('===============================================');

    res.json({ msg: 'If an account with this email exists, a reset link has been sent.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// POST /api/sellers/reset-password/:token
router.post('/reset-password/:token', validateResetPassword, async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ msg: 'Token is invalid or has expired.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    await pool.query(
      'UPDATE sellers SET password_hash = $1 WHERE id = $2',
      [passwordHash, decoded.sellerId]
    );

    res.json({ msg: 'Password has been reset successfully. You can now log in.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
