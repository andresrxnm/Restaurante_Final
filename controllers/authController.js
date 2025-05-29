const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const dotenv = require('dotenv').config();

exports.register = async (req, res) => {
  try {
    const { username, password, confirmPassword, email } = req.body;
    if (!username || !password || !email) {
      return res.status(400).render('register', {
        error: "Todos los campos son obligatorios",
        success: '',
        username,
        password,
        email,
        title: 'Registro'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).render('register', {
        error: 'Las contraseñas no coinciden',
        success: '',
        username,
        email,
        title: 'Registro'
      });
    }

    const [existUser] = await pool.query(
      'SELECT * FROM usuario WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existUser.length > 0) {
      return res.status(409).render('register', {
        error: 'El usuario o correo ya existe',
        success: '',
        username,
        email,
        title: 'Registro'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO usuario (username, password, email) VALUES (?,?,?)',
      [username, hashedPassword, email]
    );

    return res.status(201).render('login', {
      success: 'Registro exitoso. Ahora puedes iniciar sesión',
      error: '',
      email: '',
      title: 'Iniciar sesión'
    });

  } catch (error) {
    console.error('Error de registro: ', error);
    return res.status(500).render('register', {
      error: 'Error en el servidor. Inténtalo más tarde',
      success: '',
      username: req.body.username,
      email: req.body.email,
      title: 'Registro'
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).render('login', {
        error: 'Email y contraseña son obligatorios',
        success: '',
        email,
        title: 'Iniciar sesión'
      });
    }

    const [users] = await pool.query('SELECT * FROM usuario WHERE email =?', [email]);
    if (users.length === 0) {
      return res.status(400).render('login', {
        error: "Credenciales incorrectas",
        success: '',
        email,
        title: 'Iniciar sesión'
      });
    }
    const user = users[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).render('login', {
        error: 'Credenciales incorrectas',
        success: '',
        email,
        title: 'Iniciar sesión'
      });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000
    });

    return res.redirect('/dashboard');

  } catch (error) {
    console.error('Error de inicio de sesión:', error);
    return res.status(500).render('login', {
      error: 'Error en el servidor. Inténtalo más tarde.',
      success: '',
      email: req.body.email,
      title: 'Iniciar sesión'
    });
  }
};

// Salir de sesión
exports.logout = (req, res) => {
  res.clearCookie('jwt');
  return res.redirect('/login');
};

// Mostrar dashboard con variable title para la vista
exports.getDashboard = (req, res) => {
  return res.render('dashboard', {
    user: req.user,
    title: 'Dashboard'
  });
};
