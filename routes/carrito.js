const express = require('express');
const router = express.Router();
const carritoController = require('../controllers/carritoController');
const pedidoController = require('../controllers/pedidoController');
const { isAuthenticated } = require('../middleware/authMiddleware');

// Middleware para asegurar que la sesión existe
router.use((req, res, next) => {
  if (!req.session) {
    return res.status(500).send('Error de sesión. Intente recargar la página.');
  }
  next();
});

// Agregar producto al carrito
router.post('/agregar', carritoController.agregarAlCarrito);

// Ver el carrito
router.get('/', carritoController.verCarrito);

// Finalizar pedido (requiere autenticación)
router.post(
  '/finalizar',
  isAuthenticated,
  pedidoController.finalizarPedido
);

// Cancelar pedido y vaciar carrito
router.post('/cancelar', carritoController.cancelarCarrito);

module.exports = router;
