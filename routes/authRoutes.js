const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { redirectIfAuthenticated } = require('../middleware/authMiddleware');

// Mostrar formulario de login (GET)
router.get('/login', redirectIfAuthenticated, (req, res) => {
  res.render('login', {
    title: 'Iniciar sesión',
    error: '',
    success: '',
    email: ''
  });
});

// Mostrar formulario de registro (GET)
router.get('/register', redirectIfAuthenticated, (req, res) => {
  res.render('register', {
    title: 'Registro',
    error: '',
    success: '',
    username: '',
    email: ''
  });
});

// Procesar login (POST)
router.post('/login', authController.login);

// Procesar registro (POST)
router.post('/register', authController.register);

// Logout
router.get('/logout', authController.logout);

// Dashboard
router.get('/dashboard', authController.getDashboard);

module.exports = router;
