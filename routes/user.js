const express = require('express');
let router = express.Router();
const userController = require('../controllers/user');
const auth = require('../middleware/auth');

// Route for UserListing
router.get(
  '/',
  function (req, res, next) {
    auth(req, res, next);
  },
  userController.getUsersList
);

module.exports = router;