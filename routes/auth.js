const express = require('express');
let router = express.Router();
const authController = require('../controllers/auth');

// Route for Registration
router.post('/register', authController.register);

// Route for Login
router.post('/login', authController.login);

module.exports = router;