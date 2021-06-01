const express = require('express');
const app = express();
const authRoutes = require('./auth');
const userRoutes = require('./user');

app.use('/auth', authRoutes);
app.use('/user', userRoutes);

module.exports = app;