const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const usersController = require('../controllers/users.controller');

const authMiddleware = require('../middlewares/auth.middleware');

// HOME
router.get('/', (req, res, next) => {  res.render('index')})

//REGISTER
router.get ('/register', authMiddleware.isNotAuthenticated, authController.register)
router.post('/register', authMiddleware.isNotAuthenticated, authController.doRegister)

// LOG IN 
router.get ('/login', authMiddleware.isNotAuthenticated, authController.login)
router.post('/login', authMiddleware.isNotAuthenticated, authController.doLogin)

// PROFILE
router.get('/profile', authMiddleware.isAuthenticated, usersController.profile)

// LOG OUT
router.get('/logout', authMiddleware.isAuthenticated, authController.logout)

module.exports = router;