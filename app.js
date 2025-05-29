const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const methodOverride = require('method-override');
const jwt = require('jsonwebtoken');
const session = require('express-session');
require('dotenv').config();

// Rutas externas
const authRoutes = require('./routes/authRoutes');
const RestauranteRoutes = require('./routes/restaurantes'); 
const resenasRoutes = require('./routes/resenas');
const menuRoutes = require('./routes/menus');
const categoriasRoutes = require('./routes/categorias');
const indexRoutes = require('./routes/index');
const carritoRoutes = require('./routes/carrito');
const pedidosRoutes = require('./routes/pedidos');
const usuarioRoutes = require('./routes/usuarios');

// Inicializar Express
const app = express();
const PORT = process.env.PORT || 7000;

// Configuración de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

// Configurar sesión (antes de las rutas)
app.use(session({
  secret: process.env.SESSION_SECRET || 'tu-secreto-seguro',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // si usas HTTPS pon true
}));

// Middleware global para variables en vistas
app.use((req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.locals.usuario = decoded; // usuario disponible en vistas
    } catch (error) {
      res.locals.usuario = null;
    }
  } else {
    res.locals.usuario = null;
  }
  res.locals.title = 'TheFood'; // título por defecto
  next();
});

// Rutas
app.use('/restaurantes', RestauranteRoutes);
app.use('/resenas', resenasRoutes);
app.use('/menus', menuRoutes);
app.use('/categorias', categoriasRoutes);
app.use('/usuarios', usuarioRoutes);
app.use('/', authRoutes);
app.use('/', indexRoutes);
app.use('/carrito', carritoRoutes);
app.use('/pedidos', pedidosRoutes);

// Ruta home (redirige a login)
app.get('/', (req, res) => {
  res.redirect('/login');
});

// Ruta de administración
app.get('/admin', (req, res) => {
  res.render('index', { title: 'Panel de Administración' });
});

// Dashboard
app.get('/dashboard', (req, res) => {
  res.render('dashboard', { title: 'Dashboard' });
});

// 404 personalizado
app.use((req, res) => {
  res.status(404).render('error', {
    title: '404 - Página no encontrada',
    message: 'La página que buscas no existe.'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
