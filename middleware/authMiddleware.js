const jwt = require('jsonwebtoken');
require('dotenv').config();

const isAuthenticated = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    console.log('Token no encontrado en cookies.');
    return res.status(401).send('No autenticado. Debes iniciar sesión.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log('Token verificado. Usuario:', decoded);
    next();
  } catch (error) {
    console.error('Token inválido:', error.message);
    return res.status(401).send('Token inválido. Inicia sesión nuevamente.');
  }
};

const redirectIfAuthenticated = (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET);
      return res.redirect('/dashboard');
    }
    return next();
  } catch (error) {
    res.clearCookie('jwt');
    return next();
  }
};

module.exports = {
  isAuthenticated,
  redirectIfAuthenticated
};
